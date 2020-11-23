import { onMounted, ref } from '@nuxtjs/composition-api';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Mesh,
  MeshBuilder,
} from 'babylonjs';

let app: App;
const canvasRef = ref<HTMLCanvasElement>();

class App {
  private engine: Engine;
  private scene: Scene;

  constructor() {
    if (canvasRef.value) {
      this.Initialise();
      this.ConfigureCamera();
      this.ConfigureLight();
      this.AddGround();
      this.AddMesh();
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

  private AddMesh() {
    this.AddGround();
    this.AddBox();
    this.AddBoxRoof();
  }

  private AddGround() {
    const ground: Mesh = MeshBuilder.CreateGround(
      'ground',
      { width: 10, height: 10 },
      this.scene
    );
  }

  private AddBox() {
    const box = MeshBuilder.CreateBox('box', { width: 3 }, this.scene);
    box.position.y = 0.5;
    box.rotation.y = Math.PI / 4;
  }

  private AddSphere() {
    const sphere: Mesh = MeshBuilder.CreateSphere(
      'sphere',
      { diameter: 1 },
      this.scene
    );
    sphere.position.y = 0.5;
  }

  private AddBoxRoof() {
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
    roof.position.y = 1.22;
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
