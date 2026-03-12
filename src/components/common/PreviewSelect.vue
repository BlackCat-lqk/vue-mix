<template>
  <div class="preview-select">
    <span class="select-label">{{ title }}</span>

    <Select
      v-model="model"
      :options="options"
      v-bind="selectAttributes"
      :placeholder="placeholder"
      :disabled="disabled"
      class="custom-select"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Select from 'primevue/select';

interface Option {
  label: string;
  value: string | number;
}

const props = defineProps<{
  title: string;
  options: Option[] | string[] | number[];
  optionLabel?: string;
  optionValue?: string;
  placeholder?: string;
  disabled?: boolean;
}>();

const model = defineModel<string | number>();

const isObjectArray = computed(() => {
  return props.options.length > 0 && typeof props.options[0] === 'object';
});

const selectAttributes = computed(() => {
  if (isObjectArray.value) {
    return {
      optionLabel: props.optionLabel || 'label',
      optionValue: props.optionValue || 'value'
    };
  }
  return {};
});
</script>

<style scoped>
.preview-select {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.select-label {
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
}

.custom-select {
  width: 150px;
}

:deep(.p-select) {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  color: #fff;
  font-size: 0.875rem;
  min-height: 2.5rem;
  padding: 0;
}

:deep(.p-select:hover) {
  border-color: #555;
}

:deep(.p-select:focus) {
  outline: none;
  border-color: #555;
  box-shadow: 0 0 0 2px rgba(82, 39, 255, 0.2);
}

:deep(.p-select-label) {
  color: #fff;
  padding: 0.5rem;
}

:deep(.p-select-dropdown) {
  background: #1a1a1a;
  border: none;
  color: #fff;
  width: 2.5rem;
  border-radius: 0 6px 6px 0;
}

:deep(.p-select-dropdown:hover) {
  background: #333;
}

:deep(.p-select-overlay) {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:deep(.p-select-option) {
  color: #fff;
  padding: 0.5rem;
  transition: background-color 0.2s;
}
</style>
