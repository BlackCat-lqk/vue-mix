import code from "@/content/Components/RubberBand/RubberBand.vue?raw";
import { createCodeObject } from "../../../types/code";

export const rubberBand = createCodeObject(code, "Components/RubberBand", {
  installation: `npm install gsap`,
  usage: `
<template>
    <RubberBand></RubberBand>
</template>

<script setup lang="ts">
    import RubberBand from "./RubberBand.vue";
</script>
`,
});
