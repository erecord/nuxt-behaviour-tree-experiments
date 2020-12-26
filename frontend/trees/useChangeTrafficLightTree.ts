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

export enum TrafficLightEnum {
  Green = '#2dc937',
  Amber = '#db7b2b',
  Red = '#cc3232',
  White = '#ffffff',
}

// const order = ref<TrafficLightEnum[]>([
//   TrafficLightEnum.Green,
//   TrafficLightEnum.Amber,
//   TrafficLightEnum.Red,
//   TrafficLightEnum.Amber,
//   TrafficLightEnum.Red,
//   TrafficLightEnum.Green,
//   TrafficLightEnum.Red,
// ]);

// const order = ref<TrafficLightEnum[]>([
//   TrafficLightEnum.Green,
//   TrafficLightEnum.Amber,
//   TrafficLightEnum.Red,
//   TrafficLightEnum.Amber,
//   // TrafficLightEnum.Amber,
// ]);
const actionsPerformedCount = ref<number>(0);

const trafficLightState = ref<TrafficLightEnum>(TrafficLightEnum.White);
// const changeColorDelay = ref<number>(1500);
const nodeState = ref<NodeState>();
const runningState = ref<boolean>(false);
const colorSequence = ref<TrafficLightEnum[]>([]);

const colourSequenceLength = computed(() => colorSequence.value.length);

// Blackboard
interface ITrafficLightBlackboard {
  trafficLightState: Ref<TrafficLightEnum>;
  // changeColorDelay: Ref<number>;
  nodeState: Ref<NodeState | undefined>;
  start(): void;
  stop(): void;
  tick(): NodeState;
  colorSequence: Ref<TrafficLightEnum[]>;
}
// Behaviour Tree
// ##############
// Actions
const setTrafficLightGreenAction = new ActionNode<ITrafficLightBlackboard>(
  ({ trafficLightState }) => {
    console.log('Green');
    actionsPerformedCount.value++;

    trafficLightState.value = TrafficLightEnum.Green;
    return NodeState.Success;
  }
);
const setTrafficLightYellowAction = new ActionNode<ITrafficLightBlackboard>(
  ({ trafficLightState }) => {
    console.log('Amber');
    actionsPerformedCount.value++;
    trafficLightState.value = TrafficLightEnum.Amber;
    return NodeState.Success;
  }
);
const setTrafficLightRedAction = new ActionNode<ITrafficLightBlackboard>(
  ({ trafficLightState }) => {
    console.log('Red');
    actionsPerformedCount.value++;
    trafficLightState.value = TrafficLightEnum.Red;
    return NodeState.Success;
  }
);
// Conditions
const greenShouldShow = new ConditionNode<ITrafficLightBlackboard>(
  ({ colorSequence }) => {
    const colourSequenceIndex =
      actionsPerformedCount.value % colourSequenceLength.value;
    return colorSequence.value[colourSequenceIndex] === TrafficLightEnum.Green;
  }
);

const amberShouldShow = new ConditionNode<ITrafficLightBlackboard>(
  ({ colorSequence }) => {
    const colourSequenceIndex =
      actionsPerformedCount.value % colourSequenceLength.value;
    return colorSequence.value[colourSequenceIndex] === TrafficLightEnum.Amber;
  }
);

const redShouldShow = new ConditionNode<ITrafficLightBlackboard>(
  ({ colorSequence }) => {
    const colourSequenceIndex =
      actionsPerformedCount.value % colourSequenceLength.value;
    return colorSequence.value[colourSequenceIndex] === TrafficLightEnum.Red;
  }
);

// Timer before action
const setGreen = new TimerNode(1000, setTrafficLightGreenAction);
const setYellow = new TimerNode(1000, setTrafficLightYellowAction);
const setRed = new TimerNode(1000, setTrafficLightRedAction);

// Sequences
const green = new SequenceNode([greenShouldShow, setGreen]);
const yellow = new SequenceNode([amberShouldShow, setYellow]);
const red = new SequenceNode([redShouldShow, setRed]);

// Selector
const selector = new SelectorNode([green, yellow, red]);

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
  };
};

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
const shouldStop = () => nodeState.value !== NodeState.Failure;

const tick = () => {
  console.info('Tick');

  return repeatUntilFailureNode.tick(useTreeContext());
};

const tickUntilStopped = async () => {
  // interval = setInterval(() => {
  //   nodeState.value = repeatUntilFailureNode.tick(memory);
  //   if (shouldStop()) stop();
  // }, POLLING_DELAY);

  if (runningState.value) {
    nodeState.value = tick();

    if (shouldStop()) {
      // await waitForDelay(changeColorDelay.value);
      await waitForDelay(100);
      tickUntilStopped();
    } else {
      stop();
    }
  }
};

export default function (): ITrafficLightBlackboard {
  onMounted(() => {
    const { trafficLightState } = useTreeContext();
    trafficLightState.value = TrafficLightEnum.White;
  });
  onUnmounted(() => stop());
  return useTreeContext();
}
