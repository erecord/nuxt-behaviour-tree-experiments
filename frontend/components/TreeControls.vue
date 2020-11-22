<template>
  <div>
    <Button :text="'Start'" @click="start" />
    <Button :text="'Stop'" @click="stop" />
    <Button :text="'Reset'" @click="reset" />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  props: {
    start: Function,
    stop: Function,
    reset: Function,
  },
});
</script>
