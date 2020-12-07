import { onMounted, ref } from '@nuxtjs/composition-api';
import {
  InterpolateValueAction,
  ActionManager,
  Color3,
  SetValueAction,
  ExecuteCodeAction,
  Action,
  Mesh,
  PredicateCondition,
} from 'babylonjs';
import useBabylon from '../hooks/babylon';

export default () => {
  const {
    canvasRef,
    sceneRef,
    onHTMLReady,
    useMeshBuilder,
    useLightBuilder,
    useCameraBuilder,
    useApplyMaterial,
    useApplyWaves,
    useDTOBuilder,
    useActionManager,
  } = useBabylon();

  const { BuildArcRotateCamera } = useCameraBuilder();
  const { BuildGround, BuildBox } = useMeshBuilder();
  const { BuildHemisphericLight } = useLightBuilder();
  const { ApplyGroundMaterial } = useApplyMaterial();
  const { ApplySineWave } = useApplyWaves();
  const { BuildVector3 } = useDTOBuilder();
  const { BuildActionManager } = useActionManager();

  const MoveBoxUpRef = ref<Function>();

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

    const box = BuildBox(BuildVector3(0, 0.5, 0), 1);
    // ApplySineWave(box, 0.01);

    MoveBoxUpRef.value = (amount: number) => (box.position.y += amount);

    // let alpha = 0;
    // sceneRef.value!.onBeforeRenderObservable.add(function () {
    //   box.scaling.y = Math.sin(alpha);
    //   alpha += 0.01;
    // });

    const state = { isUp: false };

    const actionManager = BuildActionManager();

    box.actionManager = actionManager;

    box.actionManager
      .registerAction(
        new InterpolateValueAction(
          ActionManager.OnPickTrigger,
          box,
          'scaling',
          BuildVector3(10, 10, 10),
          1000,
          new PredicateCondition(actionManager, () => state.isUp)
        )
      )
      ?.then(
        new InterpolateValueAction(
          ActionManager.NothingTrigger,
          box,
          'scaling',
          BuildVector3(1, 1, 1),
          2000
        )
      );

    box.actionManager
      .registerAction(
        new InterpolateValueAction(
          ActionManager.OnPickTrigger,
          box,
          'position.y',
          5,
          1000,
          new PredicateCondition(actionManager, () => !state.isUp)
        )
      )
      ?.then(
        new SetValueAction(
          { trigger: ActionManager.NothingTrigger },
          state,
          'isUp',
          true
        )
      )
      ?.then(
        new InterpolateValueAction(
          ActionManager.NothingTrigger,
          box,
          'position.y',
          0.5,
          1000
        )
      );
  });
  return { canvasRef, MoveBoxUpRef };
};
