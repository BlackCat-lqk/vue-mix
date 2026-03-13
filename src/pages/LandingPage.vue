<template>
  <section class="landing-wrapper">
    <Dither class="prism-box" :wave-speed="0.05" :wave-frequency="1" :wave-amplitude="0.2" :wave-color="[0.1, 0.4, 0.3]"
      :color-num="7" :pixel-size="2" :disable-animation="false" :enable-mouse-interaction="true" :mouse-radius="0.3" />
    <Hero />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Dither from "@/components/landing/PlasmaWave/BitsDither.vue";
import Hero from "../components//landing/Hero/HeroView.vue";

const isMobile = ref(false);

const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  document.title = "Vue Mix - Components For Vue";
  window.scrollTo(0, 0);
  checkIsMobile();
  window.addEventListener("resize", checkIsMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkIsMobile);
});
</script>
