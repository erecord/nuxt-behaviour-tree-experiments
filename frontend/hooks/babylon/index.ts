import { onUnmounted, ref } from '@nuxtjs/composition-api';
import { Engine, Scene } from 'babylonjs';

import useCameraBuilder from './CameraBuilder';
import useLightBuilder from './LightBuilder';
import useMeshBuilder from './MeshBuilder';
import useDTOBuilder from './DTOBuilder';

import useApplyMaterial from './ApplyMaterial';
import useApplyWaves from './ApplyWaves';
import useActionManager from './ActionManager';

const canvasRef = ref<HTMLCanvasElement>();
const engineRef = ref<Engine>();
const sceneRef = ref<Scene>();

export default function () {
  // const { ConfigureEvents } = useApplyEvents();
  const onHTMLReady = () => {
    ConfigureCanvas();
    ConfigureBabylon();
    // ConfigureEvents();

    window.addEventListener('resize', resizeBabylon);
    Render();
  };

  onUnmounted(() => {
    window.removeEventListener('resize', resizeBabylon);
  });

  const ConfigureCanvas = () => {
    // canvasRef.value!.style.width = '100%';
    // canvasRef.value!.style.height = '100%';
    // canvasRef.value!.style.maxHeight = '100%';
    canvasRef.value!.id = 'babylonCanvas';
  };

  const resizeBabylon = () => engineRef.value?.resize();

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
    useActionManager,
  };
}
