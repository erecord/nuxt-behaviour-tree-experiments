<template>
  <div class="flex justify-center items-center mt-4">
    <p>Tree State</p>
    <div :class="'h-12 w-12 ml-3 ' + stateColour"></div>
  </div>
</template>

<script>
import { computed, defineComponent, Ref } from '@nuxtjs/composition-api';
import { NodeState } from '@yoody/behaviour-tree';

export default defineComponent({
  props: {
    currentNodeState: Ref,
  },
  setup(props) {
    const stateColour = computed(() => {
      switch (props.currentNodeState) {
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

    return { stateColour };
  },
});
</script>
