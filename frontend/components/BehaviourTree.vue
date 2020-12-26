<template>
  <div>
    <div v-for="(child, index) in parent.children" :key="index">
      {{ child }}
    </div>
  </div>
</template>

<script lang="ts">
// Recursive
// A reference to children, who also have a refernce to the parent
import { defineComponent } from '@nuxtjs/composition-api';
import trafficLightBT from '../trees/useChangeTrafficLightTree';

interface INode {
  parent?: INode;
  children?: INode[];
}

const child1: INode = {};
const child2: INode = {};
const parent: INode = { children: [child1, child2] };
export default defineComponent({
  setup() {
    return { parent };
  },
});
</script>
