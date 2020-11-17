<template>
  <div>
    <Button :text="'Start'" @click="start" />
    <Button :text="'Stop'" @click="stop" />
    <Button :text="'Reset'" @click="reset" />

    <div class="flex justify-center items-center mt-4">
      <p>Tree State</p>
      <div :class="'h-12 w-12 ml-3 ' + stateColour"></div>
    </div>
    <div class="flex justify-center items-center mt-4">
      <p>Current Count {{ runningCount }}</p>
    </div>
    <div class="flex justify-center items-center gap-2 mt-4">
      <p>Target Count</p>
      <input v-model="targetCount" class="w-10 border border-gray-400" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api';
import { NodeState } from '@yoody/behaviour-tree';
import BehaviourTree from '../components/BehaviourTree.vue';
import useBT from '../hooks/useBehaviourTree';

export default defineComponent({
  setup() {
    const {
      startCountToBT,
      stopCountToBT,
      resetBehaviourTree,
      currentState,
      runningCount,
    } = useBT();

    const targetCount = ref<number>(10);

    const stateColour = computed(() => {
      switch (currentState.value) {
        case NodeState.Success:
          return 'bg-green-500';
        case NodeState.Failure:
          return 'bg-red-500';
        case NodeState.Running:
          return 'bg-orange-500';
        default:
          return 'bg-blue-500';
      }
    });

    return {
      start: () => startCountToBT(targetCount.value),
      stop: stopCountToBT,
      reset: resetBehaviourTree,
      stateColour,
      runningCount,
      targetCount,
    };
  },
});
</script>
