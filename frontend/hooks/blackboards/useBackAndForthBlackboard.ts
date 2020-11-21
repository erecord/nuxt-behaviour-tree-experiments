import { ref, Ref } from '@nuxtjs/composition-api';

export interface IBlackboard {
  currentPosition: Ref<number>;
  reset: Function;
}

const currentPosition = ref<number>(0);

export default function (): IBlackboard {
  const reset = () => (currentPosition.value = 0);
  return { currentPosition, reset };
}
