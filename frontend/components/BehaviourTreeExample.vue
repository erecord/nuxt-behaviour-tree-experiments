<template>
  <div>
    <Button :text="'Start'" @click="start" />
    <Button :text="'Stop'" @click="stop" />
    <Button :text="'Reset'" @click="reset" />

    <TreeState :current-node-state="currentNodeState" />
    <div class="flex justify-center items-center mt-4">
      <p>Current Count {{ currentCount }}</p>
    </div>
    <div class="flex justify-center items-center gap-2 mt-4">
      <p>Target Count</p>
      <input v-model="targetCount" class="w-10 border border-gray-400" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import BehaviourTree from '../components/BehaviourTree.vue';
import useBT from '../hooks/useBehaviourTree';
import useBlackboards from '../hooks/useBlackboards';

export default defineComponent({
  setup() {
    const { startCountToBT, stopCountToBT, currentNodeState } = useBT();
    const { currentCount, targetCount, reset } = useBlackboards();

    return {
      start: startCountToBT,
      stop: stopCountToBT,
      reset,
      currentNodeState,
      currentCount,
      targetCount,
    };
  },
});
</script>
