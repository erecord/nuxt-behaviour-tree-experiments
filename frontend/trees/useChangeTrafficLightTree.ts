import { ref, Ref } from '@nuxtjs/composition-api';
import {
  ActionNode,
  NodeState,
  RepeatUntilFailureNode,
  SequenceNode,
  SelectorNode,
  ConditionNode,
} from '@yoody/behaviour-tree';

enum TrafficLightEnum {
  Green = '#2dc937',
  Yellow = '#db7b2b',
  Red = '#cc3232',
}

// Blackboard
interface ITrafficLightBlackboard {
  trafficLightState: Ref<TrafficLightEnum>;
  changeColorDelay: Ref<number>;
  startBehaviourTree: Function;
  stopBehaviourTree: Function;
  nodeState: Ref<NodeState | undefined>;
}
// Behaviour Tree

const setTrafficLightGreenAction = new ActionNode<ITrafficLightBlackboard>(
  ({ trafficLightState, changeColorDelay }) => {
    console.log('Green');

    trafficLightState.value = TrafficLightEnum.Green;
    changeColorDelay.value = 5000;
    return NodeState.Success;
  }
);
const setTrafficLightYellowAction = new ActionNode<ITrafficLightBlackboard>(
  ({ trafficLightState, changeColorDelay }) => {
    console.log('Yellow');
    trafficLightState.value = TrafficLightEnum.Yellow;
    changeColorDelay.value = 1250;
    return NodeState.Success;
  }
);
const setTrafficLightRedAction = new ActionNode<ITrafficLightBlackboard>(
  ({ trafficLightState, changeColorDelay }) => {
    console.log('Red');
    trafficLightState.value = TrafficLightEnum.Red;
    changeColorDelay.value = 5000;
    return NodeState.Success;
  }
);

const displayGreenCondition = new ConditionNode<ITrafficLightBlackboard>(
  ({ trafficLightState }) => trafficLightState.value === TrafficLightEnum.Red
);

const displayYellowCondition = new ConditionNode<ITrafficLightBlackboard>(
  ({ trafficLightState }) => trafficLightState.value === TrafficLightEnum.Green
);

const displayRedCondition = new ConditionNode<ITrafficLightBlackboard>(
  ({ trafficLightState }) => trafficLightState.value === TrafficLightEnum.Yellow
);

const green = new SequenceNode([
  displayGreenCondition,
  setTrafficLightGreenAction,
]);

const yellow = new SequenceNode([
  displayYellowCondition,
  setTrafficLightYellowAction,
]);
const red = new SequenceNode([displayRedCondition, setTrafficLightRedAction]);

const trafficLightSequence = new SelectorNode([green, yellow, red]);

const repeatUntilFailureNode = new RepeatUntilFailureNode(trafficLightSequence);

const trafficLightState = ref<TrafficLightEnum>(TrafficLightEnum.Red);
const changeColorDelay = ref<number>(1500);

// Methods
const stop = () => (shouldStop = true);

const nodeState = ref<NodeState>();

let shouldStop = false;

const useMemory = (): ITrafficLightBlackboard => {
  return {
    startBehaviourTree: start,
    stopBehaviourTree: stop,
    nodeState,
    trafficLightState,
    changeColorDelay,
  };
};

const waitForDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const start = async () => {
  // interval = setInterval(() => {
  //   nodeState.value = repeatUntilFailureNode.tick(memory);
  //   if (shouldStop()) stop();
  // }, POLLING_DELAY);

  if (!shouldStop) {
    nodeState.value = repeatUntilFailureNode.tick(useMemory());
    if (nodeState.value !== NodeState.Failure) {
      await waitForDelay(changeColorDelay.value);
      start();
    }
  } else {
    shouldStop = false;
  }
};

export default function (): ITrafficLightBlackboard {
  return useMemory();
}
