<template>
  <canvas ref="canvasRef" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import useTransformNode from '../hooks/useBabylon/useTransformNode';

export default defineComponent({
  setup() {
    const { canvasRef } = useTransformNode();
    return { canvasRef };
  },
});
</script>
