<template>
  <div class="flex">
    <div v-for="(colour, index) in colourSequence" :key="index">
      <div class="h-16 w-32">
        <div
          :class="`w-full h-full opacity-100 bg-white flex flex-col justify-end items-center
          ${index === activeIndex ? 'border-4 border-yellow-400' : ''}`"
          :style="{ backgroundColor: colour }"
        >
          <div>
            <!-- {{ colour }} -->
            {{ activeIndex }}
          </div>
        </div>
      </div>
      <!-- {{ colour }} -->
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  props: {
    colourSequence: Array,
    activeIndex: Number,
  },
  // setup() {
  //   return {};
  // },
});
</script>
