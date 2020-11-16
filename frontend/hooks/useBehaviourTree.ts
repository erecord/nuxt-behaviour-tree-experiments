import { ActionNode, NodeState } from '@yoody/behaviour-tree';
import { TestBlackboard } from './useBlackboards';

const callback = () => {
  console.log('I ran!');

  return NodeState.Success;
};

export default function () {
  const actionNode = new ActionNode<TestBlackboard>(callback);

  actionNode.tick();

  return {};
}
