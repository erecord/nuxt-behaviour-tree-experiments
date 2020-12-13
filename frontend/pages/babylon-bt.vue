<template>
  <div class="flex flex-col h-screen w-screen">
    <canvas
      ref="canvasRef"
      class="flex-shrink"
      :style="`height: ${babylonCanvasHeight}%`"
    />
    <div class="flex-grow">
      <button class="" @click="start">Start</button>
      <button class="" @click="stop">Stop</button>
      <Slider :default="babylonCanvasHeight" @input="handleSliderInputEvent" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import scene from '../scenes/BehaviourTree';

export default defineComponent({
  setup() {
    const { canvasRef, start, stop } = scene();

    const babylonCanvasHeight = ref<number>(55);

    const handleSliderInputEvent = (event: { target: { value: number } }) => {
      const sliderValue = event.target?.value;

      babylonCanvasHeight.value = sliderValue;
    };

    return {
      canvasRef,
      start,
      stop,
      babylonCanvasHeight,
      handleSliderInputEvent,
    };
  },
});
</script>
