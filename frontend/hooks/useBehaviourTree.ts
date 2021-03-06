import {
  ActionNode,
  ConditionNode,
  NodeState,
  RepeatUntilFailureNode,
  SequenceNode,
} from '@yoody/behaviour-tree';
import { onUnmounted, ref, Ref } from '@nuxtjs/composition-api';
import useBlackboards from './useBlackboards';
import { IBlackboard } from '~/types';

const DELAY = 200;
let interval: NodeJS.Timeout;
const currentNodeState = ref<NodeState>();

// #region Commands

const consoleLogCommand = (value: any) => {
  console.log(value);
  return NodeState.Success;
};

const checkLessThanToCommand = (number1: number, number2: number) => {
  return number1 < number2;
};

const incrementNumberRefCommand = (numberRef: Ref<number>) => {
  numberRef.value++;
  return NodeState.Success;
};
// #endregion

const stopCountToBT = () => clearInterval(interval);

export default function () {
  onUnmounted(() => stopCountToBT());
  // #region Actions
  const printNumberAction = new ActionNode<IBlackboard>(({ currentCount }) =>
    consoleLogCommand(currentCount.value)
  );

  const incrementRunningCountAction = new ActionNode<IBlackboard>(
    ({ currentCount }) => incrementNumberRefCommand(currentCount)
  );

  const checkForLimitReachedAction = new ConditionNode<IBlackboard>(
    ({ currentCount, targetCount }) =>
      checkLessThanToCommand(currentCount.value, targetCount.value)
  );

  // #endregion

  const countToTenSequence = new SequenceNode([
    checkForLimitReachedAction,
    incrementRunningCountAction,
    // printNumberAction,
  ]);

  const repeatUntilFailureNode = new RepeatUntilFailureNode(countToTenSequence);

  const stopBTCondition = () => currentNodeState.value === NodeState.Failure;

  const startCountToBT = () => {
    interval = setInterval(() => {
      currentNodeState.value = repeatUntilFailureNode.tick(useBlackboards());
      if (stopBTCondition()) stopCountToBT();
    }, DELAY);
  };

  return {
    currentNodeState,
    startCountToBT,
    stopCountToBT,
  };
}
