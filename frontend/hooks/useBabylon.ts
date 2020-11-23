import { onMounted, ref } from '@nuxtjs/composition-api';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Texture,
  Vector4,
} from 'babylonjs';

let app: App;
const canvasRef = ref<HTMLCanvasElement>();

const faceUV: Vector4[] = [];
faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); // rear face
faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); // front face
faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); // right side
faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); // left side

class App {
  private engine: Engine;
  private scene: Scene;

  constructor() {
    if (canvasRef.value) {
      this.Initialise();
      this.ConfigureCamera();
      this.ConfigureLight();
      this.CreateMesh();
      this.ConfigureEvents();
      this.Render();
    }
  }

  private Initialise() {
    if (canvasRef.value) {
      // create the canvas html element and attach it to the webpage
      // this.canvas = document.createElement('canvas') as HTMLCanvasElement;
      canvasRef.value.style.width = '100%';
      canvasRef.value.style.height = '100%';
      canvasRef.value.id = 'babylonCanvas';
      // document.body.appendChild(this.canvas);
      // initialize babylon scene and engine
      this.engine = new Engine(canvasRef.value, true);
      this.scene = new Scene(this.engine);
    }
  }

  private ConfigureCamera() {
    const camera: ArcRotateCamera = new ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 2.5,
      10,
      new Vector3(0, 0, 0),
      this.scene
    );
    camera.position = new Vector3(5, 4, 0);
    camera.attachControl(canvasRef.value, true);
  }

  private ConfigureLight() {
    const light1: HemisphericLight = new HemisphericLight(
      'light1',
      new Vector3(1, 1, 0),
      this.scene
    );
  }

  private CreateMesh() {
    this.CreateGround();
    const house = this.CreateHouse();
  }

  private CreateHouse() {
    const box: Mesh = this.CreateBox();
    const roof: Mesh = this.CreateBoxRoof();

    return Mesh.MergeMeshes([box, roof], true, false, undefined, false, true);
  }

  private CreateGround() {
    const ground: Mesh = MeshBuilder.CreateGround(
      'ground',
      { width: 10, height: 10 },
      this.scene
    );

    this.ApplyGroundMaterial(ground);
  }

  private CreateBox() {
    const box = MeshBuilder.CreateBox(
      'box',
      { width: 1, faceUV, wrap: true },
      this.scene
    );
    box.position.y = 0.5;
    box.rotation.y = Math.PI / 4;

    this.ApplyBoxMaterial(box);
    return box;
  }

  private AddSphere() {
    const sphere: Mesh = MeshBuilder.CreateSphere(
      'sphere',
      { diameter: 1 },
      this.scene
    );
    sphere.position.y = 0.5;
  }

  private CreateBoxRoof() {
    const roof = MeshBuilder.CreateCylinder(
      'roof',
      {
        diameter: 1.3,
        height: 1.2,
        tessellation: 3,
      },
      this.scene
    );
    roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2;
    roof.rotation.y = -Math.PI / 4;
    roof.position.y = 1.22;

    this.ApplyRoofMaterial(roof);
    return roof;
  }

  private ApplyGroundMaterial(mesh: Mesh) {
    const groundMat = new StandardMaterial('groundMat', this.scene);
    groundMat.diffuseColor = new Color3(0, 1, 0);
    mesh.material = groundMat;
  }

  private ApplyRoofMaterial(mesh: Mesh) {
    const roofMat = new StandardMaterial('roofMat', this.scene);
    roofMat.diffuseTexture = new Texture(
      'https://assets.babylonjs.com/environments/roof.jpg',
      this.scene
    );
    mesh.material = roofMat;
  }

  private ApplyBoxMaterial(mesh: Mesh) {
    const boxMat = new StandardMaterial('roofMat', this.scene);
    boxMat.diffuseTexture = new Texture(
      'https://doc.babylonjs.com/_next/image?url=%2Fimg%2Fgetstarted%2Fcubehouse.png&w=1080&q=75',
      this.scene
    );
    mesh.material = boxMat;
  }

  private ConfigureEvents() {
    // hide/show the Inspector
    window.addEventListener('keydown', (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
        if (this.scene.debugLayer.isVisible()) {
          this.scene.debugLayer.hide();
        } else {
          this.scene.debugLayer.show();
        }
      }
    });
  }

  private Render() {
    // run the main render loop
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}

export default function () {
  onMounted(() => {
    app = new App();
  });

  return { app, canvasRef };
}
