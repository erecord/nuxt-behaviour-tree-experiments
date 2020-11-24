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
  TransformNode,
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

    const box = this.BuildBox('box', 1);

    const node = this.BuildTransformNode('node', box);

    this.ApplyRotationEachFrame(node, 0.01);

    this.ApplySineWave(node, 0.05);
  }

  private lookupX(input: number) {
    return Math.sin(input);
  }

  private sineWave() {
    for (let i = 0; i < 100; i++) {
      console.log(this.lookupX(i));
    }
  }

  private ApplySineWave(node: TransformNode, incrementValue: number) {
    let y = 0;
    this.scene.registerBeforeRender(() => {
      node.position.y = this.lookupX(y) * 5 + 10;
      y += incrementValue;
    });
  }

  private BuildBox(name: string, width: number, height: number = width) {
    const box = MeshBuilder.CreateBox(
      name,
      { width, height, faceUV, wrap: true },
      this.scene
    );
    box.position.y = 0.5;
    // box.rotation.y = Math.PI / 4;

    // this.ApplyBoxMaterial(box);
    return box;
  }

  private ApplyRotationEachFrame(mesh: TransformNode, radians: number = 0.01) {
    // Animation
    let angle = 0;
    this.scene.registerBeforeRender(function () {
      mesh.rotation.y = angle;
      angle += radians;
    });
  }

  private BuildTransformNode(name: string, child: Mesh) {
    // create a Center of Transformation
    const CoT = new TransformNode(name, this.scene);
    child.parent = CoT; // apply to Box
    return CoT;
  }

  private CreateGround() {
    const ground: Mesh = MeshBuilder.CreateGround(
      'ground',
      { width: 10, height: 10 },
      this.scene
    );

    this.ApplyGroundMaterial(ground);
  }

  private ApplyGroundMaterial(mesh: Mesh) {
    const groundMat = new StandardMaterial('groundMat', this.scene);
    groundMat.diffuseColor = new Color3(0.2, 0.5, 0.9);
    mesh.material = groundMat;
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

export default () => {
  onMounted(() => {
    app = new App();
  });

  return { app, canvasRef };
};
