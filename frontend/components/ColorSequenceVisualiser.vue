<template>
  <div class="flex">
    <div
      v-for="(color, index) in colorSequence"
      :key="index"
      @click="$emit('remove-color', color)"
    >
      <div class="h-16 w-32">
        <div
          :class="`w-full h-full bg-white flex flex-col justify-end items-center
          ${index === activeIndex ? 'border-4 border-yellow-400' : ''}`"
          :style="{ backgroundColor: color.color }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import { IColorEntity } from '../trees/useChangeTrafficLightTree';

interface Props {
  activeIndex: Number;
  colorSequence: IColorEntity[];
}

export default defineComponent({
  props: {
    colorSequence: Array,
    activeIndex: Number,
  },
});
</script>
