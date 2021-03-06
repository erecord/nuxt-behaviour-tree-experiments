import { ref } from '@nuxtjs/composition-api';
import { IBlackboard } from '~/types';

const DEFAULT_TARGET_COUNT = 10;
const currentCount = ref<number>(0);
const targetCount = ref<number>(DEFAULT_TARGET_COUNT);

export default function (): IBlackboard {
  const reset = () => {
    currentCount.value = 0;
    targetCount.value = DEFAULT_TARGET_COUNT;
  };

  return { currentCount, targetCount, reset };
}
