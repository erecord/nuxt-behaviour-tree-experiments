import { Ref } from '@nuxtjs/composition-api';

export interface IBlackboard {
  currentCount: Ref<number>;
  targetCount: Ref<number>;
  reset: Function;
}
