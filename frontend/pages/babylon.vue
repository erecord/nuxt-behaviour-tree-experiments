<template>
  <div />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import useBabylon from '../hooks/useBabylon';

export default defineComponent({
  setup() {
    useBabylon();
    return {};
  },
});
</script>
