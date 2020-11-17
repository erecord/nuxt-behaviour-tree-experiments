import { ref } from '@nuxtjs/composition-api';
import { NodeState } from '@yoody/behaviour-tree';
import { IBlackboard } from '~/types';

const DEFAULT_TARGET_COUNT = 10;
const currentNodeState = ref<NodeState>();
const currentCount = ref<number>(0);
const targetCount = ref<number>(DEFAULT_TARGET_COUNT);

export default function (): IBlackboard {
  const reset = () => {
    currentCount.value = 0;
    currentNodeState.value = undefined;
    targetCount.value = DEFAULT_TARGET_COUNT;
  };

  return { currentNodeState, currentCount, targetCount, reset };
}
