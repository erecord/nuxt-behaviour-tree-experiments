import { onMounted } from '@nuxtjs/composition-api';
import { Color3, StandardMaterial } from 'babylonjs';
import useBabylon from '../hooks/babylon';
import useBT, { TrafficLightEnum } from '../trees/useChangeTrafficLightTree';

export default () => {
  const {
    canvasRef,
    sceneRef,
    onHTMLReady,
    useMeshBuilder,
    useLightBuilder,
    useCameraBuilder,
    useApplyMaterial,
    useDTOBuilder,
  } = useBabylon();

  const {
    trafficLightState,
    start: startBehaviourTree,
    stop: stopBehaviourTree,
    tick,
    nodeState,
    colorSequence,
  } = useBT();

  const { BuildArcRotateCamera } = useCameraBuilder();
  const { BuildGround, BuildBox } = useMeshBuilder();
  const { BuildHemisphericLight } = useLightBuilder();
  const { ApplyGroundMaterial } = useApplyMaterial();
  const { BuildVector3 } = useDTOBuilder();

  onMounted(() => {
    onHTMLReady();

    colorSequence.value = [
      TrafficLightEnum.Green,
      TrafficLightEnum.Amber,
      TrafficLightEnum.Red,
      TrafficLightEnum.Amber,
    ];

    BuildArcRotateCamera(
      -Math.PI / 2,
      Math.PI / 2.5,
      10,
      BuildVector3(5, 4, 0)
    );

    BuildHemisphericLight(BuildVector3(1, 1, 0));

    const ground = BuildGround(10);
    ApplyGroundMaterial(ground);

    const box = BuildBox(BuildVector3(0, 0.5, 0), 1);
    // startBehaviourTree();

    const color = new StandardMaterial('color', sceneRef.value!);
    sceneRef.value?.onBeforeRenderObservable.add(() => {
      const trafflicLightColorHex = trafficLightState.value;
      color.diffuseColor = Color3.FromHexString(trafflicLightColorHex);
      box.material = color;
    });
  });

  return {
    canvasRef,
    tick,
    nodeState,
    start: startBehaviourTree,
    stop: stopBehaviourTree,
  };
};
