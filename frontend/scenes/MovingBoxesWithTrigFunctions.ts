import { onMounted } from '@nuxtjs/composition-api';
import useBabylon from '../hooks/babylon';

export default () => {
  const {
    canvasRef,
    onHTMLReady,
    useMeshBuilder,
    useLightBuilder,
    useCameraBuilder,
    useApplyMaterial,
    useApplyWaves,
    useDTOBuilder,
  } = useBabylon();

  const { BuildArcRotateCamera } = useCameraBuilder();
  const { BuildGround, BuildBox } = useMeshBuilder();
  const { BuildHemisphericLight } = useLightBuilder();
  const { ApplyGroundMaterial } = useApplyMaterial();
  const { ApplySineWave, ApplyCosineWave, ApplyTanWave } = useApplyWaves();
  const { BuildVector3 } = useDTOBuilder();

  onMounted(() => {
    onHTMLReady();

    BuildArcRotateCamera(
      -Math.PI / 2,
      Math.PI / 2.5,
      10,
      BuildVector3(5, 4, 0)
    );

    BuildHemisphericLight(BuildVector3(1, 1, 0));

    const ground = BuildGround(10);
    ApplyGroundMaterial(ground);

    const box = BuildBox(BuildVector3(-3, 0, 0), 1);
    const box1 = BuildBox(BuildVector3(0, 0, 0), 1);
    const box2 = BuildBox(BuildVector3(0, 0, 3), 1);
    ApplySineWave(box, 0.01);
    ApplyTanWave(box1, 0.01);
    ApplyCosineWave(box2, 0.01);
  });

  return { canvasRef };
};
