<template>
  <div class="rubber-band-root" ref="rootEl">
    <svg class="rubber-band-svg" viewBox="0 0 800 600">
      <path :d="rubberPath" :stroke="strokeColor" :stroke-width="thickness" stroke-linecap="round" fill="none" />
      <g>
        <foreignObject :x="(anchor.x + fixedPointX)" :y="(anchor.y + fixedPointY)" width="56" height="56">
          <div>
            <img src="/assets/circle.svg" alt="circle" />
          </div>
        </foreignObject>
      </g>
      <g class="handle-group" :transform="`translate(${handle.x - 64}, ${handle.y})`">
        <foreignObject width="128" height="128">
          <div class="handle" :class="{ dragging: dragging }" @mousedown.prevent="onPointerDown">
            <img src="/assets/pendant_light.svg" alt="drag" />
          </div>
        </foreignObject>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";

const props = withDefaults(
  defineProps<{
    length?: number;
    stiffness?: number;
    fixedPointX?: number;
    fixedPointY?: number;
  }>(),
  {
    length: 80,
    stiffness: 1,
    fixedPointX: 400,
    fixedPointY: 60,
  },
);

const rootEl = ref<HTMLElement | null>(null);

// 顶部固定锚点（始终不动，从这里开始拉）
const anchor = reactive({ x: props.fixedPointX, y: props.fixedPointY });

// 只有一个末端质点，整根橡皮筋用一条贝塞尔曲线近似
const handle = reactive({ x: anchor.x, y: anchor.y + props.length });

let vx = 0;
let vy = 0;

// 物理参数（单质点弹簧 + 重力）
const MASS = 1;
const BASE_K = 55; // 基础刚度
const DAMP = 6; // 阻尼：越大越快停下
const GRAVITY = 520; // 重力：控制整体下坠感

const dragging = ref(false);
const thickness = ref(9);

let lastTime = 0;
let rafId: number | null = null;

// 根据锚点和手柄计算“下垂”的控制点，让整条线始终从锚点发出
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

function step(time: number) {
  const dt = Math.min((time - lastTime) / 1000, 1 / 30);
  lastTime = time;

  if (!dragging.value) {
    const restY = anchor.y + props.length;
    const k = BASE_K * props.stiffness;

    const dx = handle.x - anchor.x;
    const dy = handle.y - restY; // 平衡位置在 anchor 下方 length 距离

    // 弹簧力 + 阻尼 + 重力
    const fx = -k * dx - DAMP * vx;
    const fy = -k * dy - DAMP * vy + GRAVITY * MASS;

    const ax = fx / MASS;
    const ay = fy / MASS;

    vx += ax * dt;
    vy += ay * dt;

    handle.x += vx * dt;
    handle.y += vy * dt;

    // 边界约束，防止飞出视口
    handle.x = Math.max(80, Math.min(820, handle.x));
    handle.y = Math.max(80, Math.min(860, handle.y));

    const speed = Math.sqrt(vx * vx + vy * vy);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (speed < 10 && dist < 2) {
      handle.x = anchor.x;
      handle.y = restY;
      vx = 0;
      vy = 0;
      rafId = null;
      return;
    }
  }

  rafId = requestAnimationFrame(step);
}

function ensureLoop() {
  if (rafId == null) {
    lastTime = performance.now();
    rafId = requestAnimationFrame(step);
  }
}

function getSvgCoords(evt: MouseEvent) {
  const svg = rootEl.value?.querySelector("svg");
  if (!svg) return { x: handle.x, y: handle.y };
  const pt = (svg as SVGSVGElement).createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  const ctm = (svg as SVGSVGElement).getScreenCTM();
  if (!ctm) return { x: handle.x, y: handle.y };
  const p = pt.matrixTransform(ctm.inverse());
  return {
    x: Math.max(80, Math.min(720, p.x)),
    y: Math.max(80, Math.min(360, p.y)),
  };
}

function onPointerDown(e: MouseEvent) {
  dragging.value = true;
  thickness.value = 7;

  const pos = getSvgCoords(e);
  vx = 0;
  vy = 0;
  handle.x = pos.x;
  handle.y = pos.y;

  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", onPointerUp);
}

function onPointerMove(e: MouseEvent) {
  if (!dragging.value) return;
  const pos = getSvgCoords(e);
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 1 / 30) || 1 / 60;

  vx = (pos.x - handle.x) / dt;
  vy = (pos.y - handle.y) / dt;

  handle.x = pos.x;
  handle.y = pos.y;
}

function onPointerUp() {
  if (!dragging.value) return;
  dragging.value = false;
  thickness.value = 9;
  window.removeEventListener("mousemove", onPointerMove);
  window.removeEventListener("mouseup", onPointerUp);
  ensureLoop();
}

onMounted(() => {
  handle.x = anchor.x;
  handle.y = anchor.y + props.length;
  ensureLoop();
});

onUnmounted(() => {
  window.removeEventListener("mousemove", onPointerMove);
  window.removeEventListener("mouseup", onPointerUp);
  if (rafId != null) cancelAnimationFrame(rafId);
});
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
  width: 128px;
  height: 128px;
}

.handle {
  width: 128px;
  height: 128px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 20%, #ffffff, #d9e4ff 35%, #7a8cff 100%);
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  overflow: hidden;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.handle.dragging {
  cursor: grabbing;
  transform: scale(1.02);
  box-shadow:
    0 14px 32px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.4);
}

.handle img {
  width: 128px;
  height: 128px;
}
</style>
