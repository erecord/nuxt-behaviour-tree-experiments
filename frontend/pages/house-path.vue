<template>
  <canvas ref="canvasRef" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import scene from '../scenes/ModellingHouseAndPath';

export default defineComponent({
  setup() {
    const { canvasRef } = scene();
    return { canvasRef };
  },
});
</script>
