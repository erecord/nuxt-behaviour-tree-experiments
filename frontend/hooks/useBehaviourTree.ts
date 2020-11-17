import {
  ActionNode,
  ConditionNode,
  NodeState,
  RepeatUntilFailureNode,
  SequenceNode,
} from '@yoody/behaviour-tree';
import { onMounted, onUnmounted, Ref, ref } from '@nuxtjs/composition-api';
import { blackboard, Blackboard } from './useBlackboards';

const DELAY = 200;

const runningCount = ref<number>(0);
const maxCount = 10;

const printNumberCommand = (numberRef: Ref<number>) => {
  console.log(`Current Value: ${numberRef.value}`);
  return NodeState.Success;
};

const checkLessThanEqualToCommand = (number1: number, number2: number) => {
  return number1 <= number2;
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
  checkLessThanEqualToCommand(runningCount.value, maxCount)
);

const countToTenSequence = new SequenceNode<Blackboard>([
  printNumberAction,
  incrementNumberAction,
  checkForLimitReachedAction,
]);

const repeatUntilFailureNode = new RepeatUntilFailureNode<Blackboard>(
  countToTenSequence
);

export default function () {
  let interval: NodeJS.Timeout;

  onMounted(() => {
    interval = setInterval(() => {
      const result = repeatUntilFailureNode.tick(blackboard);
      if (result === NodeState.Failure) clearInterval(interval);
      console.log(result);
    }, DELAY);
  });

  onUnmounted(() => clearInterval(interval));

  return {};
}
