<template>
  <div class="skeleton-root" :class="[className, { 'is-animated': animated }]" :style="{
    '--sk-base': baseColor,
    '--sk-highlight': highlightColor,
    '--sk-radius': normalizedRadius,
    '--sk-speed': `${speed}s`,
  }" role="status" aria-live="polite" aria-busy="true">
    <div v-if="preset === 'single'" class="sk-block" :style="blockStyle" />

    <div v-else-if="preset === 'text'" class="sk-stack" :style="{ gap: `${gap}px` }">
      <div v-for="i in lines" :key="i" class="sk-block" :style="lineStyle(i)" />
    </div>

    <div v-else-if="preset === 'avatar'" class="sk-row" :style="{ gap: `${gap}px` }">
      <div class="sk-block sk-circle" :style="avatarStyle" />
      <div class="sk-stack sk-grow" :style="{ gap: `${Math.max(6, gap - 2)}px` }">
        <div class="sk-block" :style="titleLineStyle" />
        <div class="sk-block" :style="subtitleLineStyle" />
      </div>
    </div>

    <div v-else-if="preset === 'list'" class="sk-list sk-wrap" :style="{ gap: `${gap}px` }">
      <div v-for="i in items" :key="i" class="sk-card">
        <div class="sk-row" :style="{ gap: `${gap}px` }">
          <div class="sk-block sk-circle"
            :style="{ width: `${Math.max(32, height * 2)}px`, height: `${Math.max(32, height * 2)}px` }" />
          <div class="sk-stack sk-grow" :style="{ gap: `${Math.max(6, gap - 2)}px` }">
            <div class="sk-block" :style="{ height: `${Math.max(14, height)}px`, width: '45%' }" />
            <div class="sk-block" :style="{ height: `${height}px`, width: '80%' }" />
          </div>
        </div>
        <div class="sk-stack" :style="{ gap: `${Math.max(6, gap - 2)}px`, marginTop: '12px' }">
          <div class="sk-block" :style="{ height: `${height}px`, width: '100%' }" />
          <div class="sk-block" :style="{ height: `${height}px`, width: '92%' }" />
          <div class="sk-block" :style="{ height: `${height}px`, width: '70%' }" />
        </div>
      </div>
    </div>

    <div v-else-if="preset === 'table'" class="sk-table sk-wrap" :style="{
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      columnGap: `${gap}px`,
      rowGap: `${Math.max(10, gap)}px`,
    }">
      <template v-for="r in rows" :key="r">
        <div v-for="c in cols" :key="`${r}-${c}`" class="sk-block sk-cell" :style="{
          height: `${Math.max(14, height)}px`,
          width: r === 1 ? (c === 1 ? '40%' : '32%') : c === 1 ? '70%' : '100%',
        }" />
      </template>
    </div>

    <div v-else-if="preset === 'tableDense'" class="sk-table sk-wrap sk-table-dense" :style="{
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      columnGap: `${Math.max(4, gap - 4)}px`,
      rowGap: `${Math.max(6, gap - 4)}px`,
    }">
      <template v-for="r in rows" :key="`dense-${r}`">
        <div v-for="c in cols" :key="`dense-${r}-${c}`" class="sk-block sk-cell" :style="{
          height: `${Math.max(10, height - 2)}px`,
          width: r === 1 ? (c === 1 ? '38%' : '26%') : c === 1 ? '60%' : '100%',
        }" />
      </template>
    </div>

    <div v-else-if="preset === 'grid'" class="sk-grid sk-wrap" :style="{
      gridTemplateColumns: `repeat(${Math.min(4, cols)}, minmax(0, 1fr))`,
      columnGap: `${gap}px`,
      rowGap: `${Math.max(12, gap + 2)}px`,
    }">
      <div v-for="i in items" :key="`grid-${i}`" class="sk-card sk-grid-card">
        <div class="sk-block" :style="{ height: '96px', width: '100%', borderRadius: '18px' }" />
        <div class="sk-stack" :style="{ gap: '6px', marginTop: '10px' }">
          <div class="sk-block" :style="{ height: `${Math.max(14, height)}px`, width: '70%' }" />
          <div class="sk-block" :style="{ height: `${height}px`, width: '90%' }" />
        </div>
        <div class="sk-row" :style="{ justifyContent: 'space-between', marginTop: '10px', gap: '10px' }">
          <div class="sk-block" :style="{ height: `${height}px`, width: '38%' }" />
          <div class="sk-block" :style="{ height: '32px', width: '76px', borderRadius: '999px' }" />
        </div>
      </div>
    </div>

    <div v-else class="sk-stack" :style="{ gap: `${gap}px` }">
      <div class="sk-block" :style="titleLineStyle" />
      <div class="sk-block" :style="{ ...blockStyle, height: `${Math.max(120, height)}px` }" />
      <div class="sk-row" :style="{ gap: `${gap}px` }">
        <div class="sk-block sk-grow" :style="subtitleLineStyle" />
        <div class="sk-block" :style="{ ...buttonStyle }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Preset = "single" | "text" | "avatar" | "card" | "list" | "table" | "tableDense" | "grid";

const props = withDefaults(
  defineProps<{
    className?: string;
    preset?: Preset;
    animated?: boolean;
    lines?: number;
    items?: number;
    rows?: number;
    cols?: number;
    width?: number | string;
    height?: number;
    radius?: number | string;
    gap?: number;
    speed?: number;
    baseColor?: string;
    highlightColor?: string;
    lastLineWidth?: number;
  }>(),
  {
    className: "",
    preset: "text",
    animated: true,
    lines: 3,
    items: 6,
    rows: 6,
    cols: 4,
    width: "100%",
    height: 14,
    radius: 12,
    gap: 10,
    speed: 1.2,
    baseColor: "rgba(255,255,255,0.08)",
    highlightColor: "rgba(255,255,255,0.16)",
    lastLineWidth: 65,
  },
);

const normalizedRadius = computed(() =>
  typeof props.radius === "number" ? `${props.radius}px` : props.radius,
);

const normalizedWidth = computed(() =>
  typeof props.width === "number" ? `${props.width}px` : props.width,
);

const blockStyle = computed(() => ({
  width: normalizedWidth.value,
  height: `${props.height}px`,
}));

const avatarStyle = computed(() => ({
  width: `${Math.max(28, props.height * 2)}px`,
  height: `${Math.max(28, props.height * 2)}px`,
}));

const titleLineStyle = computed(() => ({
  width: "55%",
  height: `${Math.max(14, props.height)}px`,
}));

const subtitleLineStyle = computed(() => ({
  width: "78%",
  height: `${Math.max(12, props.height - 2)}px`,
}));

const buttonStyle = computed(() => ({
  width: "92px",
  height: "34px",
  borderRadius: "999px",
}));

const lines = computed(() => Math.max(1, Math.min(12, props.lines)));
const items = computed(() => Math.max(1, Math.min(20, props.items)));
const rows = computed(() => Math.max(2, Math.min(20, props.rows)));
const cols = computed(() => Math.max(2, Math.min(8, props.cols)));

function lineStyle(i: number) {
  const isLast = i === lines.value;
  const width = isLast ? `${Math.max(20, Math.min(100, props.lastLineWidth))}%` : "100%";
  return {
    width,
    height: `${props.height}px`,
  };
}
</script>

<style scoped>
.skeleton-root {
  width: 100%;
  height: 100%;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.sk-block {
  border-radius: var(--sk-radius);
  background: linear-gradient(90deg, var(--sk-base), var(--sk-highlight), var(--sk-base));
  background-size: 200% 100%;
  filter: saturate(1.05);
}

.sk-circle {
  border-radius: 999px;
}

.sk-row {
  display: flex;
  align-items: center;
}

.sk-stack {
  display: flex;
  flex-direction: column;
}

.sk-grow {
  flex: 1;
}

.sk-wrap {
  width: 100%;
}

.sk-list {
  display: flex;
  flex-direction: column;
}

.sk-card {
  padding: 14px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
}

.sk-table {
  width: 100%;
  display: grid;
  align-items: center;
}

.sk-table-dense {
  opacity: 0.92;
}

.sk-grid {
  width: 100%;
  display: grid;
}

.sk-grid-card {
  padding: 12px;
}

.sk-table-row {
  display: contents;
}

.sk-cell {
  width: 100%;
}

@media (prefers-reduced-motion: no-preference) {
  .skeleton-root.is-animated .sk-block {
    animation: shimmer var(--sk-speed) ease-in-out infinite;
  }
}

@keyframes shimmer {
  0% {
    background-position: 0% 0%;
  }

  100% {
    background-position: -200% 0%;
  }
}
</style>
