<template>
  <div class="rubber-band-root" ref="rootEl">
    <svg class="rubber-band-svg" viewBox="0 0 800 600">
      <slot name="band" :d="rubberPath" :stroke="strokeColor" :stroke-width="currentBandWidth" :dragging="dragging">
        <path :d="rubberPath" :stroke="strokeColor" :stroke-width="currentBandWidth" stroke-linecap="round"
          fill="none" />
      </slot>

      <g class="anchor">
        <foreignObject :x="anchor.x - anchorSize / 2" :y="anchor.y - anchorSize / 2" :width="anchorSize"
          :height="anchorSize">
          <div class="anchor-content">
            <slot name="anchor" :dragging="dragging">
            </slot>
          </div>
        </foreignObject>
      </g>

      <g class="handle-group" :transform="`translate(${handle.x - handleSize / 2}, ${handle.y - handleSize / 2})`">
        <foreignObject :width="handleSize" :height="handleSize">
          <div class="handle-main-box" :class="{ dragging: dragging }" @pointerdown.prevent="onPointerDown">
            <slot name="handle" :dragging="dragging">
            </slot>
          </div>
        </foreignObject>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { gsap } from "gsap";

const props = withDefaults(
  defineProps<{
    anchorX?: number;
    anchorY?: number;
    length?: number;
    bandWidth?: number;
    dragBandWidth?: number;
    elasticity?: number;
    returnDuration?: number;
    handleSize?: number;
    anchorSize?: number;
    dragMinX?: number;
    dragMaxX?: number;
    dragMinY?: number;
    dragMaxY?: number;
  }>(),
  {
    anchorX: 400,
    anchorY: 60,
    length: 80,
    bandWidth: 9,
    dragBandWidth: 7,
    elasticity: 0.4,
    returnDuration: 0.9,
    handleSize: 128,
    anchorSize: 56,
  },
);

const emit = defineEmits<{
  (e: "drag-start", payload: { x: number; y: number }): void;
  (e: "drag-move", payload: { x: number; y: number }): void;
  (e: "drag-end", payload: { x: number; y: number }): void;
}>();

const rootEl = ref<HTMLElement | null>(null);

const anchor = reactive({ x: props.anchorX, y: props.anchorY });

const handle = reactive({ x: anchor.x, y: anchor.y + props.length });

const dragging = ref(false);

const controlPoint = computed(() => {
  const midX = (anchor.x + handle.x) / 2;
  const midY = (anchor.y + handle.y) / 2;
  const dx = handle.x - anchor.x;
  const dy = handle.y - anchor.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const sagBase = Math.min(120, dist * 0.35);
  const horizontalFactor = 0.25 + Math.abs(dx) / 800;

  return {
    x: midX + dx * 0.05,
    y: midY + sagBase * horizontalFactor,
  };
});

const rubberPath = computed(() => {
  const c = controlPoint.value;
  return `M ${anchor.x} ${anchor.y} Q ${c.x} ${c.y} ${handle.x} ${handle.y}`;
});

const strokeColor = computed(() => {
  const dx = handle.x - anchor.x;
  const dy = handle.y - anchor.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const t = Math.min(dist / 260, 1);
  const r = 255 * (0.35 + 0.35 * t);
  const g = 190 * (0.8 - 0.5 * t);
  const b = 120 * (0.65 - 0.3 * t);
  const alpha = 0.35 + 0.5 * t;
  return `rgba(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)}, ${alpha.toFixed(2)})`;
});

const currentBandWidth = computed(() => (dragging.value ? props.dragBandWidth : props.bandWidth));

function getSvgCoords(evt: PointerEvent) {
  const svg = rootEl.value?.querySelector("svg");
  if (!svg) return { x: handle.x, y: handle.y };
  const pt = (svg as SVGSVGElement).createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  const ctm = (svg as SVGSVGElement).getScreenCTM();
  if (!ctm) return { x: handle.x, y: handle.y };
  const p = pt.matrixTransform(ctm.inverse());

  const clamp = (v: number, min?: number, max?: number) => {
    if (typeof min === "number") v = Math.max(min, v);
    if (typeof max === "number") v = Math.min(max, v);
    return v;
  };

  return {
    x: clamp(p.x, props.dragMinX, props.dragMaxX),
    y: clamp(p.y, props.dragMinY, props.dragMaxY),
  };
}

function onPointerDown(e: PointerEvent) {
  dragging.value = true;
  gsap.killTweensOf(handle);

  const pos = getSvgCoords(e);
  handle.x = pos.x;
  handle.y = pos.y;
  emit("drag-start", { x: handle.x, y: handle.y });

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  window.addEventListener("pointercancel", onPointerUp, { passive: true });
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return;
  const pos = getSvgCoords(e);
  handle.x = pos.x;
  handle.y = pos.y;
  emit("drag-move", { x: handle.x, y: handle.y });
}

function onPointerUp() {
  if (!dragging.value) return;
  dragging.value = false;

  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
  window.removeEventListener("pointercancel", onPointerUp);
  emit("drag-end", { x: handle.x, y: handle.y });

  gsap.to(handle, {
    x: anchor.x,
    y: anchor.y + props.length,
    duration: props.returnDuration,
    ease: `elastic.out(1, ${props.elasticity})`,
  });
}

onMounted(() => {
  handle.x = anchor.x;
  handle.y = anchor.y + props.length;
});

onUnmounted(() => {
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
  window.removeEventListener("pointercancel", onPointerUp);
  gsap.killTweensOf(handle);
});

watch(
  () => [props.anchorX, props.anchorY, props.length] as const,
  ([x, y, length]) => {
    anchor.x = x;
    anchor.y = y;
    if (!dragging.value) {
      gsap.killTweensOf(handle);
      handle.x = anchor.x;
      handle.y = anchor.y + length;
    }
  },
);
</script>

<style scoped>
.rubber-band-root {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.rubber-band-svg {
  width: 100%;
  height: 100%;
}

.handle-group {
  width: 0;
  height: 0;
}

.handle-main-box {
  width: 100%;
  height: 100%;
}

.dragging {
  cursor: grabbing;
  transform: scale(1.02);
  box-shadow:
    0 14px 32px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.4);
}
</style>
