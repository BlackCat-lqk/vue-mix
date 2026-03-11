<template>
  <div class="contribute-container">
    <h2 class="demo-title-contribute">Help improve this component!</h2>

    <div class="contribute-buttons">
      <a :href="bugReportUrl" target="_blank" rel="noreferrer" class="contribute-button">
        <i class="pi pi-exclamation-triangle"></i>
        <span>Report an issue</span>
      </a>

      <span class="contribute-separator">or</span>

      <a :href="featureRequestUrl" target="_blank" rel="noreferrer" class="contribute-button">
        <i class="pi pi-lightbulb"></i>
        <span>Request a feature</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const bugReportUrl = computed(() => {
  const category = route.params.category;
  const subcategory = route.params.subcategory;
  const title = encodeURIComponent(`[BUG]: ${category}/${subcategory}`);
  return `https://github.com/DavidHDev/vue-bits/issues/new?template=1-bug-report.yml&title=${title}&labels=bug`;
});

const featureRequestUrl = computed(() => {
  const category = route.params.category;
  const subcategory = route.params.subcategory;
  const title = encodeURIComponent(`[FEAT]: ${category}/${subcategory}`);
  return `https://github.com/DavidHDev/vue-bits/issues/new?template=2-feature-request.yml&title=${title}&labels=enhancement`;
});
</script>
