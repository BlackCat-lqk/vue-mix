<template>
  <div :class="['gradient-border', halo ? '' : 'unsetHalo', className]" v-bind="$attrs" :style="{
    '--glow-color1': color[0],
    '--glow-color2': color[1],
    '--glow-color3': color[2],
    '--line-size': lineSize + 'px',
    '--animation-state': animation ? 'running' : 'paused',
    '--animation-duration': animationDuration + 's'
  }" @click="handleSubmit">
    <div class="glow1 glow" :style="{ '--glow-color1': color[0] }"></div>
    <div class="glow2 glow" :style="{ '--glow-color2': color[1] }"></div>
    <div class="glow3 glow" :style="{ '--glow-color3': color[2] }"></div>
    <div class="white-glow glow"></div>
    <slot name="content"></slot>
  </div>
</template>

<script lang="ts" setup>
interface GradientFlowProps {
  className?: string
  animation?: boolean
  color?: string[]
  halo?: boolean
  lineSize?: number,
  animationDuration?: number,
}

const {
  className = "",
  color = ["#ff7dd6", "#3dfcff", "#a193f6"],
  halo = true,
  lineSize = 4,
  animation = true,
  animationDuration = 3
} = defineProps<GradientFlowProps>()

defineOptions({ inheritAttrs: false })
const emit = defineEmits(["click"])

const handleSubmit = () => {
  emit("click")
}
</script>

<style scoped>
.gradient-border {
  position: absolute;
  cursor: pointer;
  border-radius: 100px;
  width: 100%;
  height: 100%;
  --radius: 100px;
  border-radius: var(--radius);
  border: var(--line-size) solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gradient-border::before {
  content: " ";
  position: absolute;
  inset: calc(var(--line-size) * -1);
  border: inherit;
  border-radius: inherit;
  background-image: conic-gradient(from var(--angle) at 50% 50%,
      #eeebff 0deg,
      var(--glow-color3) 90deg,
      var(--glow-color2) 180deg,
      var(--glow-color1) 270deg,
      #eeebff 360deg);
  background-origin: border-box;
  -webkit-mask: linear-gradient(black, black), linear-gradient(black, black);
  mask: linear-gradient(black, black), linear-gradient(black, black);
  -webkit-mask-clip: content-box, border-box;
  mask-clip: content-box, border-box;
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: spin linear infinite;
  animation-duration: var(--animation-duration, 3s);
  animation-play-state: var(--animation-state, running);
}

.gradient-border .glow {
  position: absolute;
  inset: calc(var(--line-size) * -1);
  border-radius: inherit;
}

.gradient-border .glow::after {
  content: "";
  position: absolute;
  inset: calc(var(--line-size) * -1);
  border: calc(var(--line-size) * 2) solid transparent;
  border-radius: inherit;
  background-image: conic-gradient(from var(--angle) at 50% 50%,
      #eeebff 0deg,
      transparent 90deg,
      transparent 180deg,
      transparent 270deg,
      #eeebff 360deg);
  background-origin: border-box;
  -webkit-mask: linear-gradient(black, black), linear-gradient(black, black);
  mask: linear-gradient(black, black), linear-gradient(black, black);
  -webkit-mask-clip: content-box, border-box;
  mask-clip: content-box, border-box;
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: spin linear infinite;
  animation-duration: var(--animation-duration, 4s);
  animation-play-state: var(--animation-state, running);
}

.white-glow {
  filter: blur(20px);
}

.gradient-border .glow3::after {
  background-image: conic-gradient(from var(--angle) at 50% 50%,
      transparent 0deg,
      var(--glow-color3) 90deg,
      transparent 180deg);
  border: calc(var(--line-size) * 1) solid transparent;
}

.glow3 {
  filter: blur(7px);
}

.gradient-border .glow1::after {
  background-image: conic-gradient(from var(--angle) at 50% 50%,
      transparent 180deg,
      var(--glow-color1) 270deg,
      transparent 360deg);
  border: calc(var(--line-size) * 1) solid transparent;
}

.glow1 {
  filter: blur(8px);
}

.gradient-border .glow2::after {
  background-image: conic-gradient(from var(--angle) at 50% 50%,
      transparent 90deg,
      var(--glow-color2) 180deg,
      transparent 270deg);
  border: calc(var(--line-size) * 2) solid transparent;
}

.glow2 {
  filter: blur(15px);
}

.unsetHalo .glow2::after {
  background-image: unset;
}

.unsetHalo .glow1::after {
  background-image: unset;
}

.unsetHalo .glow3::after {
  background-image: unset;
}

.unsetHalo .glow::after {
  background-image: unset;
}

@property --angle {
  syntax: "<angle>";
  inherits: true;
  initial-value: 0turn;
}

@keyframes spin {
  to {
    --angle: 1turn;
  }
}
</style>
