<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px] overflow-hidden">
        <RubberBand :anchor-x="anchorX" :anchor-y="anchorY" :length="length" :band-width="bandWidth"
          :drag-band-width="dragBandWidth" :elasticity="elasticity" :return-duration="returnDuration"
          :handle-size="handleSize" :anchor-size="anchorSize" v-bind="dragBoundsProps" @drag-end="onDragEnd">
          <template #anchor>
            <div class="anchor-content">
              <img src="/assets/circle.svg" alt="anchor" />
            </div>
          </template>
          <template #handle>
            <div class="handle"
              :style="handleLight ? 'background: radial-gradient(circle at 30% 20%, rgb(255 255 255), rgb(255 255 255) 35%, rgb(133 139 182) 100%)' : ''">
              <img v-if="handleLight" src="/assets/pendant_light.svg" alt="handle" />
              <img v-else src="/assets/pendant_dark.svg" alt="handle" />
            </div>

          </template>
        </RubberBand>
      </div>

      <Customize>
        <PreviewSlider title="Anchor X" v-model="anchorX" :min="60" :max="740" :step="10" />
        <PreviewSlider title="Anchor Y" v-model="anchorY" :min="40" :max="240" :step="10" />
        <PreviewSlider title="Length" v-model="length" :min="60" :max="420" :step="10" />
        <PreviewSlider title="Band width" v-model="bandWidth" :min="1" :max="30" :step="1" />
        <PreviewSlider title="Drag band width" v-model="dragBandWidth" :min="1" :max="30" :step="1" />
        <PreviewSlider title="Return duration (s)" v-model="returnDuration" :min="0.1" :max="2.5" :step="0.1" />
        <PreviewSlider title="Elasticity" v-model="elasticity" :min="0.1" :max="2" :step="0.05" />
        <PreviewSlider title="Handle size" v-model="handleSize" :min="48" :max="200" :step="8" />
        <PreviewSlider title="Anchor size" v-model="anchorSize" :min="16" :max="120" :step="4" />

        <PreviewSwitch title="Enable drag bounds" v-model="enableBounds" />
        <PreviewSlider v-if="enableBounds" title="Min X" v-model="dragMinX" :min="-200" :max="800" :step="10" />
        <PreviewSlider v-if="enableBounds" title="Max X" v-model="dragMaxX" :min="-200" :max="800" :step="10" />
        <PreviewSlider v-if="enableBounds" title="Min Y" v-model="dragMinY" :min="-200" :max="800" :step="10" />
        <PreviewSlider v-if="enableBounds" title="Max Y" v-model="dragMaxY" :min="-200" :max="800" :step="10" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['gsap']" />
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
import { computed, ref } from 'vue';
import TabbedLayout from "@/components/common/TabbedLayout.vue";
import CodeExample from "@/components/code/CodeExample.vue";
import { rubberBand } from "@/constants/code/Components/RubberBandCode";
import PropTable from '@/components/common/PropTable.vue';
import Dependencies from '@/components/code/DependenciesCode.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import CliInstallation from '@/components/code/CliInstallation.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';

const handleLight = ref(true);

const anchorX = ref(400);
const anchorY = ref(60);
const length = ref(180);
const bandWidth = ref(9);
const dragBandWidth = ref(7);
const returnDuration = ref(0.9);
const elasticity = ref(0.4);
const handleSize = ref(128);
const anchorSize = ref(56);

const enableBounds = ref(false);
const dragMinX = ref(80);
const dragMaxX = ref(720);
const dragMinY = ref(80);
const dragMaxY = ref(360);

const dragBoundsProps = computed(() => {
  if (!enableBounds.value) return {};
  return {
    dragMinX: dragMinX.value,
    dragMaxX: dragMaxX.value,
    dragMinY: dragMinY.value,
    dragMaxY: dragMaxY.value,
  };
});

function onDragEnd() {
  handleLight.value = !handleLight.value;
}

const propData = [
  {
    name: 'className',
    type: 'string',
    default: '',
    description: 'Custom class name(s) applied to the container element.'
  },
  {
    name: "anchorX",
    type: "number",
    default: "400",
    description: "Anchor point X (in SVG viewBox coordinates).",
  },
  {
    name: "anchorY",
    type: "number",
    default: "60",
    description: "Anchor point Y (in SVG viewBox coordinates).",
  },
  {
    name: "length",
    type: "number",
    default: "80",
    description: "Rest length from anchor to handle (in px / viewBox units).",
  },
  {
    name: "bandWidth",
    type: "number",
    default: "9",
    description: "Band stroke width when idle.",
  },
  {
    name: "dragBandWidth",
    type: "number",
    default: "7",
    description: "Band stroke width while dragging.",
  },
  {
    name: "elasticity",
    type: "number",
    default: "0.85",
    description: "Elasticity factor used by GSAP elastic ease (higher = bouncier).",
  },
  {
    name: "returnDuration",
    type: "number",
    default: "0.9",
    description: "Return animation duration (seconds).",
  },
  {
    name: "handleSize",
    type: "number",
    default: "128",
    description: "Handle slot box size (px).",
  },
  {
    name: "anchorSize",
    type: "number",
    default: "56",
    description: "Anchor slot box size (px).",
  },
  {
    name: "dragMinX",
    type: "number | undefined",
    default: "undefined",
    description: "Optional drag bound: minimum X. Omit for no bound.",
  },
  {
    name: "dragMaxX",
    type: "number | undefined",
    default: "undefined",
    description: "Optional drag bound: maximum X. Omit for no bound.",
  },
  {
    name: "dragMinY",
    type: "number | undefined",
    default: "undefined",
    description: "Optional drag bound: minimum Y. Omit for no bound.",
  },
  {
    name: "dragMaxY",
    type: "number | undefined",
    default: "undefined",
    description: "Optional drag bound: maximum Y. Omit for no bound.",
  },
  {
    name: "slots",
    type: "{ anchor, handle }",
    default: "-",
    description: 'Slots to customize visuals.',
  },
  {
    name: "events",
    type: '{ "drag-start", "drag-move", "drag-end" }',
    default: "-",
    description: "Emitted with { x, y } in viewBox coordinates.",
  },
];
</script>

<style scoped>
.anchor-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.anchor-content :deep(img) {
  width: 100%;
  height: 100%;
  display: block;
}

.handle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 20%, #ffffff, #d9e4ff 35%, #7a8cff 100%);
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  overflow: hidden;
  padding: 10px;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.handle img {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
