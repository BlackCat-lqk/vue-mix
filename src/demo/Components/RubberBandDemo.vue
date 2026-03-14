<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px] overflow-hidden">
        <RubberBand></RubberBand>
      </div>

      <Customize>
        <PreviewSlider title="Line Size" v-model="lineSize" :min="1" :max="20" :step="1" />

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

const lineSize = ref(4);
const propData = [
  {
    name: 'className',
    type: 'string',
    default: '',
    description: 'Custom class name(s) applied to the container element.'
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
