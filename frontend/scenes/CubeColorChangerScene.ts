import { onMounted } from '@nuxtjs/composition-api';
import { Color3, StandardMaterial } from 'babylonjs';
import useBabylon from '../hooks/babylon';
import useBT, {
  ColorsEnum,
  IColorEntity,
} from '../trees/useChangeTrafficLightTree';

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

  const { trafficLightState, colorSequence } = useBT();

  const { BuildArcRotateCamera } = useCameraBuilder();
  const { BuildGround, BuildBox } = useMeshBuilder();
  const { BuildHemisphericLight } = useLightBuilder();
  const { ApplyGroundMaterial } = useApplyMaterial();
  const { BuildVector3 } = useDTOBuilder();

  onMounted(() => {
    onHTMLReady();

    const colors = [
      ColorsEnum.Green,
      ColorsEnum.Amber,
      ColorsEnum.Red,
      ColorsEnum.Amber,
    ];

    const colorEntities = colors.map((color, index) => ({
      id: index,
      color,
    })) as IColorEntity[];

    colorSequence.value = colorEntities;

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

    const color = new StandardMaterial('color', sceneRef.value!);
    sceneRef.value?.onBeforeRenderObservable.add(() => {
      const trafficLightColorHex = trafficLightState.value;
      color.diffuseColor = Color3.FromHexString(trafficLightColorHex);
      box.material = color;
    });
  });

  return {
    canvasRef,
  };
};
