<template>
  <div>Vue Mix</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const isMobile = ref(false);

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  document.title = "Vue Bits - Animated UI Components For Vue";
  window.scrollTo(0, 0);
  checkIsMobile();
  window.addEventListener("resize", checkIsMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkIsMobile);
});
</script>
