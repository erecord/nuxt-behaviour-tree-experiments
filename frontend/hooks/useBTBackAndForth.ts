import {
  ActionNode,
  ConditionNode,
  NodeState,
  RepeatUntilFailureNode,
  SequenceNode,
  SelectorNode,
  RepeaterNode,
} from '@yoody/behaviour-tree';
import { onUnmounted, ref, Ref } from '@nuxtjs/composition-api';
import useBackAndForthBlackboard, {
  IBlackboard,
} from './blackboards/useBackAndForthBlackboard';

const DELAY = 20;
let interval: NodeJS.Timeout;
const currentNodeState = ref<NodeState>();

// #region Commands

const consoleLogCommand = (value: any) => {
  console.log(value);
  return NodeState.Success;
};

const checkEqualToCommand = (number1: number, number2: number) =>
  number1 <= number2;

const incrementNumberRefCommand = (numberRef: Ref<number>) => {
  numberRef.value++;
  return NodeState.Success;
};

const decrementNumberRefCommand = (numberRef: Ref<number>) => {
  numberRef.value--;
  return NodeState.Success;
};
// #endregion

export default function () {
  onUnmounted(() => stopCountToBT());
  // #region Actions

  const incrementRunningCountAction = new ActionNode<IBlackboard>(
    ({ currentPosition }) => incrementNumberRefCommand(currentPosition)
  );

  const decrementRunningCountAction = new ActionNode<IBlackboard>(
    ({ currentPosition }) => decrementNumberRefCommand(currentPosition)
  );

  const checkForLimitReachedAction = new ConditionNode<IBlackboard>(
    ({ currentPosition }) => checkEqualToCommand(currentPosition.value, 500)
  );

  const checkForNegativeLimitReachedAction = new ConditionNode<IBlackboard>(
    ({ currentPosition }) => checkEqualToCommand(currentPosition.value, 0)
  );

  // #endregion

  const increaseSequence = new SequenceNode([
    checkForLimitReachedAction,
    incrementRunningCountAction,
    // printNumberAction,
  ]);

  const decreaseSequence = new SequenceNode([
    checkForNegativeLimitReachedAction,
    decrementRunningCountAction,
    // printNumberAction,
  ]);

  const mainSequence = new SelectorNode([increaseSequence, decreaseSequence]);

  const repeatUntilFailureNode = new RepeaterNode(mainSequence);

  const stopBTCondition = () => currentNodeState.value === NodeState.Failure;

  const startCountToBT = () => {
    interval = setInterval(() => {
      const blackboard = useBackAndForthBlackboard();
      currentNodeState.value = repeatUntilFailureNode.tick(blackboard);
      if (stopBTCondition()) stopCountToBT();
    }, DELAY);
  };
  const stopCountToBT = () => clearInterval(interval);

  return {
    currentNodeState,
    startCountToBT,
    stopCountToBT,
  };
}
