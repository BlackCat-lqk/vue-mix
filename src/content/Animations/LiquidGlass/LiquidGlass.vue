<template>
  <div :class="props.className">
    <svg style="display: none">
      <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
        <feTurbulence type="fractalNoise" :baseFrequency="props.baseFrequency" numOctaves="1" seed="17"
          result="turbulence" />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100"
          lighting-color="white" result="specLight">
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
        <feDisplacementMap in="SourceGraphic" in2="softMap" :scale="props.scale" xChannelSelector="R"
          yChannelSelector="G" />
      </filter>
    </svg>
    <div class="liquidGlass-wrapper" :style="wrapperStyle">
      <div class="liquidGlass-effect"></div>
      <div class="liquidGlass-tint"></div>
      <div class="liquidGlass-shine"></div>
      <div class="liquidGlass-text">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
defineOptions({
  inheritAttrs: false
})
interface Props {
  className?: string
  radius?: number
  blur?: number
  tintColor?: string
  tintOpacity?: number
  scale?: number,
  baseFrequency?: string,
}
const props = withDefaults(defineProps<Props>(), {
  className: '',
  radius: 20,
  blur: 1,
  tintColor: '255, 255, 255',
  tintOpacity: 0.25,
  scale: 200,
  baseFrequency: '0.001 0.005'
})
const wrapperStyle = computed(() => ({
  '--radius': `${props.radius}px`,
  '--blur': `${props.blur}px`,
  '--tint-color': props.tintColor,
  '--tint-opacity': props.tintOpacity
}))
</script>
<style scoped>
.liquidGlass-wrapper {
  position: relative;
  display: flex;
  overflow: hidden;
  box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: var(--radius);
  width: 100%;
  height: 100%;
  transition: box-shadow 0.3s ease, border-radius 0.3s ease;
}

.liquidGlass-wrapper:hover {
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(0, 0, 0, 0.15);
}

.liquidGlass-effect {
  position: absolute;
  z-index: 0;
  inset: 0;
  backdrop-filter: blur(var(--blur));
  filter: url(#glass-distortion);
  overflow: hidden;
  isolation: isolate;
  border-radius: var(--radius);
}

.liquidGlass-tint {
  z-index: 1;
  position: absolute;
  inset: 0;
  background: rgba(var(--tint-color), var(--tint-opacity));
}

.liquidGlass-shine {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  box-shadow: inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5),
    inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5);
}

.liquidGlass-text {
  z-index: 3;
}

.liquidGlass-effect,
.liquidGlass-tint,
.liquidGlass-shine {
  will-change: transform;
  transform: translateZ(0);
}

@media (max-width: 768px) {
  .liquidGlass-effect {
    backdrop-filter: blur(2px);
  }

  .liquidGlass-tint {
    background: rgba(255, 255, 255, 0.15);
  }
}
</style>
