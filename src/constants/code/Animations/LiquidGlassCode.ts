import code from "@/content/Animations/LiquidGlass/LiquidGlass.vue?raw";
import { createCodeObject } from "../../../types/code";

export const liquidGlass = createCodeObject(code, "Animations/LiquidGlass", {
  installation: ``,
  usage: `
<template>
    <LiquidGlass>
      <div class="glass-content">
      </div>
    </LiquidGlass>
</template>

<script setup lang="ts">
    import LiquidGlass from "./LiquidGlass.vue";
</script>

<style scoped>
  .glass-content {
    width: 600px;
    height: 400px;
  }
</style>
`,
});
