<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[600px] overflow-hidden">
        <div class="bg-img">
          <LiquidGlass :radius="radius" :blur="blur" :tintOpacity="opacity" :scale="scale"
            :tintColor="rgbToComma(color)" :baseFrequency="frequencyString(frequencyX, frequencyY)">
            <div class="glass-content">
              <img src="../../../public/assets/safari.svg" alt="safari">
              <div class="app-text">
                <span>Safari</span>
              </div>
            </div>
          </LiquidGlass>
        </div>
      </div>

      <Customize>
        <PreviewColor title="Color1" v-model="color" />
        <PreviewSlider title="Color Opacity" v-model="opacity" :min="0" :max="1" :step="0.01" />
        <PreviewSlider title="FrequencyX" v-model="frequencyX" :min="0" :max="1" :step="0.001" />
        <PreviewSlider title="FrequencyY" v-model="frequencyY" :min="0" :max="1" :step="0.001" />
        <PreviewSlider title="Radius" v-model="radius" :min="1" :max="100" :step="1" />
        <PreviewSlider title="Blur" v-model="blur" :min="0" :max="50" :step="1" />
        <PreviewSlider title="scale" v-model="scale" :min="50" :max="500" :step="10" />
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
import PreviewColor from '@/components/common/PreviewColor.vue';

const radius = ref(20);
const blur = ref(1);
const opacity = ref(0.1);
const scale = ref(200);
const frequencyX = ref(0.001);
const frequencyY = ref(0.005);
const color = ref('rgb(255, 255, 255)');

const frequencyString = (x: number, y: number) => {
  return `${x} ${y}`;
};
const rgbToComma = (hex: string) => {
  let hexColor = hex.replace('#', '');
  if (hexColor.length === 3) {
    hexColor = hexColor.split('').map(char => char + char).join('');
  }
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}


const propData = [
  {
    name: "className",
    type: "string",
    default: "",
    description: "Custom class name(s) applied to the container element.",
  },
  {
    name: "radius",
    type: "number",
    default: "20",
    description: "Set rounded corners.",
  },
  {
    name: "blur",
    type: "number",
    default: "1",
    description: "Set the degree of blurriness.",
  },
  {
    name: "tintColor",
    type: "string",
    default: "255, 255, 255",
    description: "Set the color of the glass.",
  },
  {
    name: "tintOpacity",
    type: "number",
    default: "0.25",
    description: "Set the transparency of the color of the glass.",
  },
  {
    name: "scale",
    type: "number",
    default: "200",
    description: "Set the distortion degree of the glass.",
  },
  {
    name: "baseFrequency",
    type: "string",
    default: "0.001 0.005",
    description: "Set the ripples of the glass.",
  },
];
</script>

<style scoped>
.bg-img {
  width: 100%;
  height: 100%;
  background-image: url("../../../public/assets/cat.png");
  background-size: cover;
  animation: liquid-glass-img 30s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;
}

.glass-content {
  width: 600px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.glass-content .app-text {
  color: #fff;
  font-size: 2rem;
  text-align: center;
}

@keyframes liquid-glass-img {
  0% {
    background-position: 0% 0%;
  }

  100% {
    background-position: 100% 100%;
  }
}
</style>
