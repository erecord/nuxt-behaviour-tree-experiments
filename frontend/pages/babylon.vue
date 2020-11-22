<template>
  <canvas ref="canvasRef" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import useBabylon from '../hooks/useBabylon';

export default defineComponent({
  setup() {
    const { canvasRef } = useBabylon();
    return { canvasRef };
  },
});
</script>
