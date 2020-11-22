<template>
  <div>
    <div class="flex justify-center items-center mt-4">
      <p>Traffic Light Colour</p>
      <div
        :class="'h-12 w-12 ml-3'"
        :style="`background-color: ${trafficLightState}`"
      ></div>
    </div>
    <TreeControls :start="startBehaviourTree" :stop="stopBehaviourTree" />
  </div>
</template>
<script>
import { defineComponent } from '@nuxtjs/composition-api';
import useChangeTrafficLightsTree from '../trees/useChangeTrafficLightTree';

export default defineComponent({
  setup() {
    const {
      trafficLightState,
      startBehaviourTree,
      stopBehaviourTree,
    } = useChangeTrafficLightsTree();
    return {
      trafficLightState,
      startBehaviourTree,
      stopBehaviourTree,
    };
  },
});
</script>
