<template>
  <div class="preview-switch">
    <span class="switch-label">{{ title }}</span>

    <ToggleSwitch v-model="model" :disabled="disabled" />
  </div>
</template>

<script setup lang="ts">
import ToggleSwitch from 'primevue/toggleswitch';

defineProps<{
  title: string;
  disabled?: boolean;
}>();

const model = defineModel<boolean>();
</script>

<style scoped>
.preview-switch {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.switch-label {
  font-size: 14px;
  color: #fff;
}

:deep(.p-toggleswitch) {
  width: 2.5rem;
  height: 1.25rem;
  border: 1px solid #333;
  border-radius: 10px;
  outline: none;
  box-shadow: none;
}

:deep(.p-toggleswitch-slider) {
  background: #222;
  border-radius: 10px;
  transition: all 0.3s ease;
  border: none;
}

:deep(.p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider) {
  background: #fff;
}

:deep(.p-toggleswitch-handle) {
  background: #0b0b0b;
  border: 2px solid #fff;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  transition: all 0.1s ease;
  outline: none;
  box-shadow: none;
  box-sizing: border-box;
}

:deep(.p-toggleswitch:hover .p-toggleswitch-slider) {
  background: #222 !important;
}

:deep(.p-toggleswitch.p-toggleswitch-checked:hover .p-toggleswitch-slider) {
  background: #fff !important;
}

:deep(.p-toggleswitch-handle:hover) {
  background: #0b0b0b !important;
  border: 2px solid #fff !important;
  box-shadow: none !important;
  transform: none !important;
}

:deep(.p-toggleswitch-handle:focus) {
  outline: none !important;
  background: #0b0b0b !important;
  border: 2px solid #fff !important;
  box-shadow: none !important;
  transform: none !important;
}

:deep(.p-toggleswitch-handle:active) {
  background: #0b0b0b !important;
  border: 2px solid #fff !important;
  box-shadow: none !important;
  transform: none !important;
}

:deep(.p-toggleswitch:focus) {
  outline: none !important;
  box-shadow: none !important;
}

:deep(.p-toggleswitch-handle::before),
:deep(.p-toggleswitch-handle::after) {
  display: none;
}

:deep(.p-toggleswitch-handle > *) {
  border: none;
  outline: none;
}
</style>
