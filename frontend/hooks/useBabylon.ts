import { onMounted } from '@nuxtjs/composition-api';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Mesh,
  MeshBuilder,
} from 'babylonjs';

class App {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private scene: Scene;

  constructor() {
    this.Initialise();
    this.ConfigureCamera();
    this.ConfigureLight();
    this.AddMeshs();
    this.ConfigureEvents();
    this.Render();
  }

  private Initialise() {
    // create the canvas html element and attach it to the webpage
    this.canvas = document.createElement('canvas') as HTMLCanvasElement;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.id = 'gameCanvas';
    document.body.appendChild(this.canvas);
    // initialize babylon scene and engine
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);
  }

  private ConfigureCamera() {
    const camera: ArcRotateCamera = new ArcRotateCamera(
      'Camera',
      Math.PI / 2,
      Math.PI / 2,
      2,
      Vector3.Zero(),
      this.scene
    );
    camera.attachControl(this.canvas, true);
  }

  private ConfigureLight() {
    const light1: HemisphericLight = new HemisphericLight(
      'light1',
      new Vector3(1, 1, 0),
      this.scene
    );
  }

  private AddMeshs() {
    const sphere: Mesh = MeshBuilder.CreateSphere(
      'sphere',
      { diameter: 1 },
      this.scene
    );
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

let app: App;

export default function () {
  onMounted(() => (app = new App()));
  return { app };
}
