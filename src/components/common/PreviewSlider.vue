<template>
  <div class="preview-slider">
    <span class="slider-label">{{ title }}</span>

    <Slider v-model="model" :min="min" :max="max" :step="step" :disabled="disabled" class="custom-slider" />

    <span class="slider-value">{{ modelValue }}{{ valueUnit }}</span>
  </div>
</template>

<script setup lang="ts">
import Slider from 'primevue/slider';

defineProps<{
  title: string;
  min?: number;
  max?: number;
  step?: number;
  valueUnit?: string;
  disabled?: boolean;
}>();

const model = defineModel<number>();
</script>

<style scoped>
.preview-slider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.slider-label {
  font-size: 14px;
  color: #fff;
}

.custom-slider {
  width: 150px;
}

.slider-value {
  font-size: 14px;
  color: #fff;
  min-width: 3rem;
}

:deep(.p-slider) {
  background: #222;
  border-radius: 10px;
  height: 8px !important;
  border: 1px solid #333 !important;
  outline: none;
  box-shadow: none;
}

:deep(.p-slider-range) {
  background: #fff;
  border-radius: 10px;
  border: none;
}

:deep(.p-slider-handle) {
  background: #0b0b0b !important;
  border: 2px solid #fff !important;
  box-shadow: none !important;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  transition: all 0.1s ease;
  outline: none !important;
  box-sizing: border-box;
}

:deep(.p-slider-handle:hover) {
  transform: scale(1.1);
  border: 2px solid #fff !important;
  box-shadow: 0 0 8px rgba(82, 39, 255, 0.3) !important;
}

:deep(.p-slider-handle:focus) {
  outline: none !important;
  border: 2px solid #fff !important;
  box-shadow: 0 0 8px rgba(82, 39, 255, 0.5) !important;
}

:deep(.p-slider-handle:active) {
  transform: scale(1.05);
  transition: all 0.05s ease;
  border: 2px solid #fff !important;
  box-shadow: none !important;
}

:deep(.p-slider-handle::before),
:deep(.p-slider-handle::after) {
  display: none !important;
}

:deep(.p-slider-handle > *) {
  border: none !important;
  outline: none !important;
}
</style>
