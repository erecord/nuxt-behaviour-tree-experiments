<template>
  <div class="slidecontainer">
    <p>{{ valueRef }}</p>
    <input
      v-model="valueRef"
      type="range"
      min="1"
      max="100"
      @input="$emit('input', $event)"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';

export default defineComponent({
  props: {
    label: String,
    default: { type: String, default: 50 },
  },
  setup(props) {
    const valueRef = ref<String>(props.default);

    return { valueRef };
  },
});
</script>

<style scoped>
.slidecontainer {
  width: 100%;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 25px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: #4caf50;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: #4caf50;
  cursor: pointer;
}
</style>
