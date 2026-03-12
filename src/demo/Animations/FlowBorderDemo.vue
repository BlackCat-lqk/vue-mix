<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px] overflow-hidden">
        <GradientFlow class-name="gradient-box" :halo="enableHalo" :color="color" :line-size="lineSize"
          :animation="enableAnimation" :animationDuration="speed">
          <template #content>
            <p>{{ text }}</p>
          </template>
        </GradientFlow>
      </div>

      <Customize>
        <PreviewText title="Text" v-model="text" />

        <PreviewColor title="Color1" v-model="color1" />

        <PreviewColor title="Color2" v-model="color2" />

        <PreviewColor title="Color3" v-model="color3" />

        <PreviewSlider title="Line Size" v-model="lineSize" :min="1" :max="20" :step="1" />

        <PreviewSlider title="Speed (s)" v-model="speed" :min="1" :max="10" :step="1" />

        <PreviewSwitch title="Halo" v-model="enableHalo" />

        <PreviewSwitch title="Animation" v-model="enableAnimation" />

      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="[]" />
    </template>
    <template #code>
      <CodeExample :code-object="flowBorder" />
    </template>
    <template #cli>
      <CliInstallation :command="flowBorder.cli" />
    </template>
  </TabbedLayout>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import TabbedLayout from "@/components/common/TabbedLayout.vue";
import GradientFlow from "@/content/Animations/GradientFlow/GradientFlow.vue";
import CodeExample from "@/components/code/CodeExample.vue";
import { flowBorder } from "@/constants/code/Animations/FlowBorderCode";
import PropTable from '@/components/common/PropTable.vue';
import Dependencies from '@/components/code/DependenciesCode.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import PreviewText from '@/components/common/PreviewText.vue';
import CliInstallation from '@/components/code/CliInstallation.vue';

const text = ref('Hello, world!');
const lineSize = ref(4);
const color = ref(['#ff7dd6', '#3dfcff', '#a193f6']);
const speed = ref(3);
const enableHalo = ref(true);
const enableAnimation = ref(true);
const color1 = ref('#ff7dd6');
const color2 = ref('#3dfcff');
const color3 = ref('#a193f6');

watch(
  () => [color1.value, color2.value, color3.value],
  () => {
    color.value = [color1.value, color2.value, color3.value];
  }
);

const propData = [
  {
    name: 'className',
    type: 'string',
    default: '',
    description: 'Custom class name(s) applied to the container element.'
  },
  {
    name: 'color',
    type: 'array',
    default: '["#ff7dd6", "#3dfcff", "#a193f6"]',
    description: 'Sets the background color of the waves container.'
  },
  {
    name: 'halo',
    type: 'boolean',
    default: 'true',
    description: 'Whether to display the halo'
  },
  {
    name: 'lineSize',
    type: 'number',
    default: '4',
    description: 'Set the width of the border'
  },
  {
    name: 'animationDuration',
    type: 'number',
    default: '3',
    description: 'Set the speed of the animation'
  },
  {
    name: 'animation',
    type: 'boolean',
    default: 'true',
    description: 'Stop or enable the animation'
  },
];
</script>

<style scoped>
.gradient-box {
  width: 80%;
  height: 80px;
  color: #fff;
  border-radius: 40px;
  font-size: 18px;
}
</style>
