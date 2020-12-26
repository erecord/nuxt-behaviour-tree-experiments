<template>
  <div class="flex flex-col h-screen w-screen bg-green-400">
    <canvas
      ref="canvasRef"
      class="flex-shrink"
      :style="`height: ${babylonCanvasHeight}%`"
    />
    <div class="flex-grow">
      <button class="" @click="start">Start</button>
      <button class="" @click="stop">Stop</button>
      <button class="" @click="tick">Tick</button>
      <Slider :default="babylonCanvasHeight" @input="handleSliderInputEvent" />
      <TreeState :current-node-state="nodeState" />
      <ColourSequenceVisualiser
        :colour-sequence="colorSequence"
        :active-index="activeIndex"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import scene from '../scenes/BehaviourTree';

export default defineComponent({
  setup() {
    const {
      canvasRef,
      stop,
      start,
      tick,
      nodeState,
      colorSequence,
      activeIndex,
    } = scene();

    const babylonCanvasHeight = ref<number>(55);

    const handleSliderInputEvent = (event: { target: { value: number } }) => {
      const sliderValue = event.target?.value;

      babylonCanvasHeight.value = sliderValue;
    };

    return {
      canvasRef,
      start,
      nodeState,
      stop,
      tick,
      babylonCanvasHeight,
      handleSliderInputEvent,
      colorSequence,
      activeIndex,
    };
  },
});
</script>
