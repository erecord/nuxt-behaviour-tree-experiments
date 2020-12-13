<template>
  <div>
    <Button :text="'Start'" @click="start" />
    <Button :text="'Stop'" @click="stop" />
    <Button :text="'Reset'" @click="reset" />
    <div class="overflow-hidden mt-5" :style="`width: ${currentPosition}px`">
      <div ref="barElement" class="h-1 w-full bg-green-500"></div>
    </div>

    <TreeState :current-node-state="currentNodeState" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';

import useBTBackAndForth from '../hooks/useBTBackAndForth';
import useBackAndForthBlackboard from '../hooks/blackboards/useBackAndForthBlackboard';

export default defineComponent({
  setup() {
    const barElement = ref<HTMLElement>();
    const {
      startCountToBT: start,
      stopCountToBT: stop,
      currentNodeState,
    } = useBTBackAndForth();
    const { currentPosition, reset } = useBackAndForthBlackboard();

    return {
      start,
      stop,
      currentNodeState,
      barElement,
      currentPosition,
      reset,
    };
  },
});
</script>
