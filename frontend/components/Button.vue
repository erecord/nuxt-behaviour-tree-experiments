<template>
  <span class="inline-flex rounded-md shadow-sm" @click="$emit('click')">
    <button
      type="button"
      class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
    >
      {{ text }}
    </button>
  </span>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  props: {
    text: String,
  },
});
</script>
