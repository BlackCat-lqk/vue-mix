<template>
  <div class="preview-text">
    <span class="text-label">{{ title }}</span>

    <input
      v-model="model"
      class="w-[300px] px-3 py-2 bg-[#0b0b0b] border border-[#333] rounded-md text-white focus:outline-none focus:border-[#666]"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();

const model = defineModel<string>();
</script>

<style scoped>
.preview-text {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
}
</style>
