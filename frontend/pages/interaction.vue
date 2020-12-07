<template>
  <div>
    <canvas ref="canvasRef" />
    <button class="absolute" @click="handleClick">Click</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import scene from '../scenes/InteractionExperiments';

export default defineComponent({
  setup() {
    const { canvasRef, MoveBoxUpRef } = scene();

    const handleClick = () => MoveBoxUpRef.value!(3);

    return { canvasRef, handleClick };
  },
});
</script>
