import {
  ActionNode,
  ConditionNode,
  NodeState,
  RepeatUntilFailureNode,
  SequenceNode,
} from '@yoody/behaviour-tree';
import { onUnmounted, Ref, ref } from '@nuxtjs/composition-api';
import { blackboard, Blackboard } from './useBlackboards';

const DELAY = 200;
let interval: NodeJS.Timeout;

const runningCount = ref<number>(0);
const maxCount = ref<number>(0);
const currentState = ref<NodeState>();

const printNumberCommand = (numberRef: Ref<number>) => {
  console.log(`Current Value: ${numberRef.value}`);
  return NodeState.Success;
};

const checkLessThanToCommand = (number1: number, number2: number) => {
  return number1 < number2;
};

const incrementNumberCommand = (numberRef: Ref<number>) => {
  numberRef.value++;
  return NodeState.Success;
};

const printNumberAction = new ActionNode<Blackboard>(() =>
  printNumberCommand(runningCount)
);

const incrementNumberAction = new ActionNode<Blackboard>(() =>
  incrementNumberCommand(runningCount)
);

const checkForLimitReachedAction = new ConditionNode<Blackboard>(() =>
  checkLessThanToCommand(runningCount.value, maxCount.value)
);

const countToTenSequence = new SequenceNode<Blackboard>([
  checkForLimitReachedAction,
  incrementNumberAction,
  // printNumberAction,
]);

const repeatUntilFailureNode = new RepeatUntilFailureNode<Blackboard>(
  countToTenSequence
);

const resetBehaviourTree = () => {
  runningCount.value = 0;
  currentState.value = undefined;
};

const startCountToBT = (countTo: number) => {
  maxCount.value = countTo;
  interval = setInterval(() => {
    currentState.value = repeatUntilFailureNode.tick(blackboard);
    if (currentState.value === NodeState.Failure) stopCountToBT();
  }, DELAY);
};

const stopCountToBT = () => clearInterval(interval);

export default function () {
  onUnmounted(() => stopCountToBT());

  return {
    startCountToBT,
    stopCountToBT,
    resetBehaviourTree,
    currentState,
    runningCount,
  };
}
