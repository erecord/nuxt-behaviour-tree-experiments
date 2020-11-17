import { Ref } from '@nuxtjs/composition-api';
import { NodeState } from '@yoody/behaviour-tree';

export interface IBlackboard {
  currentNodeState: Ref<NodeState | undefined>;
  currentCount: Ref<number>;
  targetCount: Ref<number>;
  reset: Function;
}
