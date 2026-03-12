<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[600px] overflow-hidden">
        <div class="bg-img">
          <LiquidGlass width="500px" height="300px" :blur-strength="12" :refraction-strength="60">
            <div class="content">
              <h2>✨ 液态玻璃</h2>
              <p>鼠标移动查看效果</p>
            </div>
          </LiquidGlass>
        </div>
      </div>

      <Customize>
        <PreviewSlider title="Speed (s)" v-model="speed" :min="1" :max="10" :step="1" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="[]" />
    </template>
    <template #code>
      <CodeExample :code-object="liquidGlass" />
    </template>
    <template #cli>
      <CliInstallation :command="liquidGlass.cli" />
    </template>
  </TabbedLayout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import TabbedLayout from "@/components/common/TabbedLayout.vue";
import LiquidGlass from "@/content/Animations/LiquidGlass/LiquidGlass.vue";
import CodeExample from "@/components/code/CodeExample.vue";
import { liquidGlass } from "@/constants/code/Animations/LiquidGlassCode";
import PropTable from "@/components/common/PropTable.vue";
import Dependencies from "@/components/code/DependenciesCode.vue";
import Customize from "@/components/common/Customize.vue";
import PreviewSlider from "@/components/common/PreviewSlider.vue";
import CliInstallation from "@/components/code/CliInstallation.vue";

const speed = ref(4);

const propData = [
  {
    name: "className",
    type: "string",
    default: "",
    description: "Custom class name(s) applied to the container element.",
  },
];
</script>

<style scoped>
.bg-img {
  width: 100%;
  height: 100%;
  background-image: url("../../../public/assets/cat.png");
  background-size: cover;
}
</style>
