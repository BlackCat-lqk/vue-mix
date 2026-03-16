<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px] overflow-hidden">
        <RubberBand :length="length" :stiffness="stiffness" />
      </div>

      <Customize>
        <PreviewSlider title="Length" v-model="length" :min="80" :max="260" :step="10" />
        <PreviewSlider title="Stiffness" v-model="stiffness" :min="0.4" :max="2.2" :step="0.1" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="[]" />
    </template>
    <template #code>
      <CodeExample :code-object="rubberBand" />
    </template>
    <template #cli>
      <CliInstallation :command="rubberBand.cli" />
    </template>
  </TabbedLayout>
</template>

<script lang="ts" setup>
import RubberBand from '@/content/Components/RubberBand/RubberBand.vue'
import { ref } from 'vue';
import TabbedLayout from "@/components/common/TabbedLayout.vue";
import CodeExample from "@/components/code/CodeExample.vue";
import { rubberBand } from "@/constants/code/Components/RubberBandCode";
import PropTable from '@/components/common/PropTable.vue';
import Dependencies from '@/components/code/DependenciesCode.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import CliInstallation from '@/components/code/CliInstallation.vue';

const length = ref(180);
const stiffness = ref(1);

const propData = [
  {
    name: 'className',
    type: 'string',
    default: '',
    description: 'Custom class name(s) applied to the container element.'
  },
  {
    name: 'length',
    type: 'number',
    default: '180',
    description: 'Rest length from anchor to handle (in px).'
  },
  {
    name: 'stiffness',
    type: 'number',
    default: '1',
    description: 'Relative spring stiffness, higher means snappier rebound.'
  },
];
</script>

<style>
.demo {
  width: 100%;
  height: 100vh;
  background: #1a1a1a;
}
</style>
