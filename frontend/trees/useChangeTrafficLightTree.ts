import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  Ref,
} from '@nuxtjs/composition-api';

import {
  ActionNode,
  NodeState,
  RepeatUntilFailureNode,
  SequenceNode,
  SelectorNode,
  ConditionNode,
  TimerNode,
} from '@yoody/behaviour-tree';

export enum ColorsEnum {
  Green = '#2dc937',
  Amber = '#db7b2b',
  Red = '#cc3232',
  White = '#ffffff',
}
export interface IColorEntity {
  id: Number;
  color: String;
}

const actionsPerformedCount = ref<number>(0);

const trafficLightState = ref<string>(ColorsEnum.White);
// const changeColorDelay = ref<number>(1500);
const nodeState = ref<NodeState>();
const runningState = ref<boolean>(false);
const colorSequence = ref<IColorEntity[]>([]);

// Blackboard
interface ITrafficLightBlackboard {
  trafficLightState: Ref<string>;
  // changeColorDelay: Ref<number>;
  nodeState: Ref<NodeState | undefined>;
  start(): void;
  stop(): void;
  tick(): NodeState;
  colorSequence: Ref<IColorEntity[]>;
  activeIndex: Ref<number>;
  onRemoveColor: Function;
  reset: Function;
}
// Behaviour Tree
// ##############
// Actions
const setTrafficLightGreenAction = new ActionNode<ITrafficLightBlackboard>(
  ({ trafficLightState }) => {
    console.log('Set Green');
    incrementActionsPerformed();
    trafficLightState.value = ColorsEnum.Green;
    return NodeState.Success;
  }
);
const setTrafficAmberYellowAction = new ActionNode<ITrafficLightBlackboard>(
  ({ trafficLightState }) => {
    console.log('Set Amber');
    incrementActionsPerformed();
    trafficLightState.value = ColorsEnum.Amber;
    return NodeState.Success;
  }
);
const setTrafficLightRedAction = new ActionNode<ITrafficLightBlackboard>(
  ({ trafficLightState }) => {
    console.log('Set Red');
    incrementActionsPerformed();
    trafficLightState.value = ColorsEnum.Red;
    return NodeState.Success;
  }
);
// Conditions
const greenShouldShow = new ConditionNode<ITrafficLightBlackboard>(
  ({ colorSequence }) => {
    const colorSequenceIndex = getNextColorSequenceIndex();
    const result =
      colorSequence.value[colorSequenceIndex].color === ColorsEnum.Green;
    // console.log('Green Should Show: ', result);

    return result;
  }
);

const amberShouldShow = new ConditionNode<ITrafficLightBlackboard>(
  ({ colorSequence }) => {
    const colorSequenceIndex = getNextColorSequenceIndex();
    const result =
      colorSequence.value[colorSequenceIndex].color === ColorsEnum.Amber;
    // console.log('Amber Should Show: ', result);
    return result;
  }
);

const redShouldShow = new ConditionNode<ITrafficLightBlackboard>(
  ({ colorSequence }) => {
    const colorSequenceIndex = getNextColorSequenceIndex();
    const result =
      colorSequence.value[colorSequenceIndex].color === ColorsEnum.Red;
    // console.log('Red Should Show: ', result);

    return result;
  }
);

const getNextColorSequenceIndex = () =>
  actionsPerformedCount.value % colorSequence.value.length;

// Sequences
const green = new SequenceNode([greenShouldShow, setTrafficLightGreenAction]);
const yellow = new SequenceNode([amberShouldShow, setTrafficAmberYellowAction]);
const red = new SequenceNode([redShouldShow, setTrafficLightRedAction]);

// Selector
const createNewSelector = () =>
  new TimerNode(1000, new SelectorNode([green, yellow, red]));
let selector = createNewSelector();

// Repeater
const repeatUntilFailureNode = new RepeatUntilFailureNode(selector);

const useTreeContext = (): ITrafficLightBlackboard => {
  return {
    start,
    stop,
    nodeState,
    trafficLightState,
    // changeColorDelay,
    tick,
    colorSequence,
    activeIndex,
    onRemoveColor,
    reset,
  };
};

const activeIndex = computed(() => {
  const nextIndex = actionsPerformedCount.value;
  const activeIndex = (nextIndex - 1) % colorSequence.value.length;
  return activeIndex;
});

const waitForDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const start = () => {
  const treeNotCurrentlyRunning = !runningState.value;
  if (treeNotCurrentlyRunning) {
    runningState.value = true;
    tickUntilStopped();
  }
};
const stop = () => {
  runningState.value = false;
};
const shouldContinue = () => nodeState.value !== NodeState.Failure;

const tick = () => {
  console.info('Tick');
  if (!runningState.value) {
    runningState.value = true;
  }
  return repeatUntilFailureNode.tick(useTreeContext());
};

const incrementActionsPerformed = () => {
  if (runningState.value) {
    actionsPerformedCount.value++;
  }
};

const tickUntilStopped = async () => {
  // interval = setInterval(() => {
  //   nodeState.value = repeatUntilFailureNode.tick(memory);
  //   if (shouldStop()) stop();
  // }, POLLING_DELAY);

  if (runningState.value) {
    nodeState.value = tick();

    if (shouldContinue()) {
      // await waitForDelay(changeColorDelay.value);
      await waitForDelay(100);
      tickUntilStopped();
    } else {
      stop();
    }
  }
};

const onRemoveColor = (colorEntity: IColorEntity) => {
  const newColorSequence = colorSequence.value.filter(
    (color) => color.id !== colorEntity.id
  );

  colorSequence.value = newColorSequence;
  reset();
};

const reset = () => {
  actionsPerformedCount.value = 0;
  // runningState.value = false;
  trafficLightState.value = ColorsEnum.White;
  nodeState.value = undefined;
  selector = createNewSelector();
};

export default function (): ITrafficLightBlackboard {
  onMounted(() => {
    const { trafficLightState } = useTreeContext();
    actionsPerformedCount.value = 0;
    trafficLightState.value = ColorsEnum.White;
  });
  onUnmounted(() => stop());
  return useTreeContext();
}
