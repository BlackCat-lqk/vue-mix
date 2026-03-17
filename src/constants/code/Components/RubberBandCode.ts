import code from "@/content/Components/RubberBand/RubberBand.vue?raw";
import { createCodeObject } from "../../../types/code";

export const rubberBand = createCodeObject(code, "Components/RubberBand", {
  installation: `npm install gsap`,
  usage: `
<template>
    <RubberBand
      :anchor-x="400"
      :anchor-y="60"
      :length="180"
      :band-width="9"
      :drag-band-width="7"
      :elasticity="0.85"
      :return-duration="0.9"
      @drag-start="(p) => console.log('drag-start', p)"
      @drag-move="(p) => console.log('drag-move', p)"
      @drag-end="(p) => console.log('drag-end', p)"
    />
</template>

<script setup lang="ts">
    import RubberBand from "./RubberBand.vue";
</script>
`,
});
