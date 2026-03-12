import code from "@/content/Animations/LiquidGlass/LiquidGlass.vue?raw";
import { createCodeObject } from "../../../types/code";

export const liquidGlass = createCodeObject(code, "Animations/LiquidGlass", {
  installation: ``,
  usage: `
<template>
    <div>
        液态玻璃
    </div>
</template>

<script setup lang="ts">
    import LiquidGlass from "./LiquidGlass.vue";
</script>`,
});
