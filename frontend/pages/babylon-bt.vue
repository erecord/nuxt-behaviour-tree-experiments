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
      <button class="" @click="reset">Reset</button>

      <!-- <Slider :default="babylonCanvasHeight" @input="handleSliderInputEvent" /> -->
      <TreeState :current-node-state="nodeState" />
      <ColorSequenceVisualiser
        :color-sequence="colorSequence"
        :active-index="activeIndex"
        @remove-color="onRemoveColor"
      />
      <!-- <ColorPicker @color-change="onColorChanged" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import scene from '../scenes/CubeColorChangerScene';
import useChangeTrafficLightTree, {
  IColorEntity,
} from '~/trees/useChangeTrafficLightTree';

export default defineComponent({
  setup() {
    const { canvasRef } = scene();

    const {
      start,
      stop,
      colorSequence,
      nodeState,
      activeIndex,
      tick,
      onRemoveColor,
      reset,
    } = useChangeTrafficLightTree();

    const babylonCanvasHeight = ref<number>(55);

    const handleSliderInputEvent = (event: { target: { value: number } }) => {
      const sliderValue = event.target?.value;

      babylonCanvasHeight.value = sliderValue;
    };

    interface ColorChangedEvent {
      colors: { hex: String };
    }
    const onColorChanged = (event: ColorChangedEvent) => {
      const hexColor = event.colors.hex;
      const colorSequenceLength = colorSequence.value.length;
      colorSequence.value.push({
        id: colorSequenceLength + 1,
        color: hexColor,
      } as IColorEntity);
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
      onRemoveColor,
      reset,
      onColorChanged,
    };
  },
});
</script>
