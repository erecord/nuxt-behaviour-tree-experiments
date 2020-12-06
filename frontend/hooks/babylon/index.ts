import { ref } from '@nuxtjs/composition-api';
import { Engine, Scene } from 'babylonjs';

import useCameraBuilder from './CameraBuilder';
import useLightBuilder from './LightBuilder';
import useMeshBuilder from './MeshBuilder';
import useDTOBuilder from './DTOBuilder';

import useApplyMaterial from './ApplyMaterial';
import useApplyWaves from './ApplyWaves';
import useApplyEvents from './ApplyEvents';

const canvasRef = ref<HTMLCanvasElement>();
const engineRef = ref<Engine>();
const sceneRef = ref<Scene>();

export default function () {
  // const { ConfigureEvents } = useApplyEvents();
  const onHTMLReady = () => {
    ConfigureCanvas();
    ConfigureBabylon();
    // ConfigureEvents();
    Render();
  };

  const ConfigureCanvas = () => {
    canvasRef.value!.style.width = '100vw';
    canvasRef.value!.style.height = '100vh';
    canvasRef.value!.id = 'babylonCanvas';
  };

  const ConfigureBabylon = () => {
    engineRef.value = new Engine(canvasRef.value!, true);
    sceneRef.value = new Scene(engineRef.value);
  };

  const Render = () => {
    // run the main render loop
    engineRef.value!.runRenderLoop(() => {
      sceneRef.value!.render();
    });
  };

  return {
    onHTMLReady,
    canvasRef,
    sceneRef,
    useApplyMaterial,
    useMeshBuilder,
    useLightBuilder,
    useCameraBuilder,
    useApplyWaves,
    useDTOBuilder,
  };
}
