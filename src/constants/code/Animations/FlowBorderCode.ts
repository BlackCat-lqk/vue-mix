import code from "@/content/Animations/GradientFlow/GradientFlow.vue?raw";
import { createCodeObject } from "../../../types/code";

export const flowBorder = createCodeObject(code, "Animations/GradientFlow", {
  installation: ``,
  usage: `
<template>
    <GradientFlow class-name="gradient-box">
        <template #content>
            <p>Hello,world!</p>
        </template>
    </GradientFlow>
</template>

<script setup lang="ts">
    import GradientFlow from "./GradientFlow.vue";
</script>`,
});
