import code from "@/content/Components/SkeletonLoader/SkeletonLoader.vue?raw";
import { createCodeObject } from "../../../types/code";

export const skeletonLoader = createCodeObject(code, "Components/SkeletonLoader", {
  installation: ``,
  usage: `
<template>
  <SkeletonLoader preset="text" :lines="3" />
</template>

<script setup lang="ts">
import SkeletonLoader from "./SkeletonLoader.vue";
</script>
`,
});
