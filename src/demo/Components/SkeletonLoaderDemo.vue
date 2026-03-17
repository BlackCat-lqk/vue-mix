<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[auto] overflow-hidden">
        <!-- <SkeletonLoader :preset="preset" :animated="animated" :lines="lines" :items="items" :rows="rows" :cols="cols"
          :height="height" :gap="gap" :speed="speed" :radius="radius" :base-color="baseColor"
          :highlight-color="highlightColor" :last-line-width="lastLineWidth" /> -->
        <SkeletonLoader preset="text" :animated="animated" :lines="lines" :items="items" :rows="rows" :cols="cols"
          :height="height" :gap="gap" :speed="speed" :radius="radius" :base-color="baseColor"
          :highlight-color="highlightColor" :last-line-width="lastLineWidth" />
        <SkeletonLoader preset="avatar" :animated="animated" :lines="lines" :items="items" :rows="rows" :cols="cols"
          :height="height" :gap="gap" :speed="speed" :radius="radius" :base-color="baseColor"
          :highlight-color="highlightColor" :last-line-width="lastLineWidth" />
        <SkeletonLoader preset="card" :animated="animated" :lines="lines" :items="items" :rows="rows" :cols="cols"
          :height="height" :gap="gap" :speed="speed" :radius="radius" :base-color="baseColor"
          :highlight-color="highlightColor" :last-line-width="lastLineWidth" />
        <SkeletonLoader preset="grid" :animated="animated" :lines="lines" :items="items" :rows="rows" :cols="cols"
          :height="height" :gap="gap" :speed="speed" :radius="radius" :base-color="baseColor"
          :highlight-color="highlightColor" :last-line-width="lastLineWidth" />

      </div>

      <Customize>
        <PreviewSelect title="Preset" v-model="preset" :options="presetOptions" />
        <PreviewSwitch title="Animated" v-model="animated" />
        <PreviewSlider title="Lines" v-model="lines" :min="1" :max="8" :step="1" />
        <PreviewSlider title="Items" v-model="items" :min="1" :max="12" :step="1" />
        <PreviewSlider title="Rows" v-model="rows" :min="2" :max="14" :step="1" />
        <PreviewSlider title="Cols" v-model="cols" :min="2" :max="6" :step="1" />
        <PreviewSlider title="Height" v-model="height" :min="8" :max="28" :step="1" />
        <PreviewSlider title="Gap" v-model="gap" :min="6" :max="20" :step="1" />
        <PreviewSlider title="Radius" v-model="radius" :min="0" :max="24" :step="1" />
        <PreviewSlider title="Speed (s)" v-model="speed" :min="0.6" :max="2.5" :step="0.1" />
        <PreviewSlider title="Last line width (%)" v-model="lastLineWidth" :min="25" :max="90" :step="1" />
        <PreviewColor title="Base color" v-model="baseColor" />
        <PreviewColor title="Highlight color" v-model="highlightColor" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="[]" />
    </template>
    <template #code>
      <CodeExample :code-object="skeletonLoader" />
    </template>
    <template #cli>
      <CliInstallation :command="skeletonLoader.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TabbedLayout from "@/components/common/TabbedLayout.vue";
import CodeExample from "@/components/code/CodeExample.vue";
import PropTable from "@/components/common/PropTable.vue";
import Dependencies from "@/components/code/DependenciesCode.vue";
import Customize from "@/components/common/Customize.vue";
import CliInstallation from "@/components/code/CliInstallation.vue";
import PreviewSelect from "@/components/common/PreviewSelect.vue";
import PreviewSwitch from "@/components/common/PreviewSwitch.vue";
import PreviewSlider from "@/components/common/PreviewSlider.vue";
import PreviewColor from "@/components/common/PreviewColor.vue";

import SkeletonLoader from "@/content/Components/SkeletonLoader/SkeletonLoader.vue";
import { skeletonLoader } from "@/constants/code/Components/SkeletonLoaderCode";

const presetOptions = [
  { label: "Text", value: "text" },
  { label: "Single block", value: "single" },
  { label: "Avatar", value: "avatar" },
  { label: "Card", value: "card" },
  { label: "List", value: "list" },
  { label: "Table", value: "table" },
  { label: "Table dense", value: "tableDense" },
  { label: "Grid", value: "grid" },
];

const preset = ref<"single" | "text" | "avatar" | "card" | "list" | "table" | "tableDense" | "grid">("text");
const animated = ref(true);
const lines = ref(3);
const items = ref(6);
const rows = ref(6);
const cols = ref(4);
const height = ref(14);
const gap = ref(10);
const radius = ref(12);
const speed = ref(1.2);
const lastLineWidth = ref(65);
const baseColor = ref("rgba(255,255,255,0.08)");
const highlightColor = ref("rgba(255,255,255,0.16)");

const propData = [
  {
    name: "className",
    type: "string",
    default: "",
    description: "Custom class name(s) applied to the container element.",
  },
  {
    name: "preset",
    type: '"single" | "text" | "avatar" | "card" | "list" | "table" | "tableDense" | "grid"',
    default: '"text"',
    description: "Prebuilt skeleton layout preset.",
  },
  {
    name: "animated",
    type: "boolean",
    default: "true",
    description: "Enable/disable shimmer animation.",
  },
  {
    name: "lines",
    type: "number",
    default: "3",
    description: "Line count for the text preset.",
  },
  {
    name: "items",
    type: "number",
    default: "6",
    description: "Item count for the list preset.",
  },
  {
    name: "rows",
    type: "number",
    default: "6",
    description: "Row count for the table preset (includes header row).",
  },
  {
    name: "cols",
    type: "number",
    default: "4",
    description: "Column count for the table preset.",
  },
  {
    name: "height",
    type: "number",
    default: "14",
    description: "Block height (px).",
  },
  {
    name: "gap",
    type: "number",
    default: "10",
    description: "Gap between blocks (px).",
  },
  {
    name: "radius",
    type: "number | string",
    default: "12",
    description: "Corner radius (px or CSS value).",
  },
  {
    name: "speed",
    type: "number",
    default: "1.2",
    description: "Shimmer speed (seconds).",
  },
  {
    name: "baseColor",
    type: "string",
    default: '"rgba(255,255,255,0.08)"',
    description: "Base color for the gradient.",
  },
  {
    name: "highlightColor",
    type: "string",
    default: '"rgba(255,255,255,0.16)"',
    description: "Highlight color for the gradient.",
  },
  {
    name: "lastLineWidth",
    type: "number",
    default: "65",
    description: "Last line width (%) in the text preset.",
  },
];
</script>
