<template>
  <header class="header">
    <div class="header-container">
      <router-link to="/" class="logo">
        <img :src="VueBitsLogo" alt="logo" />
        <p>Vue Mix</p>
      </router-link>

      <div class="nav-cta-group">
        <nav class="landing-nav-items">
          <router-link class="nav-link" :class="{ 'active-link': activeItem === 'home' }" to="/"
            >Home</router-link
          >

          <router-link class="nav-link" to="/animations/flow-border">Docs</router-link>
        </nav>

        <button class="cta-button" @click="openGitHub">
          Star On GitHub
          <span ref="starCountRef" :style="{ opacity: 0 }">
            <img :src="starIcon" alt="Star Icon" />
            {{ stars }}
          </span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { watch, useTemplateRef } from "vue";
import { gsap } from "gsap";
import VueBitsLogo from "@/assets/logos/vue-mix-logo.svg";
import { useStars } from "@/composables/useStars";
import starIcon from "@/assets/common/star.svg";
import "./DisplayHeader.css";

interface Props {
  activeItem?: string | null;
}

defineProps<Props>();

const starCountRef = useTemplateRef<HTMLElement>("starCountRef");
const stars = useStars();

const openGitHub = () => {
  window.open("https://github.com/BlackCat-lqk/vue-mix", "_blank");
};

watch(
  stars,
  (newStars) => {
    if (newStars && starCountRef.value) {
      gsap.fromTo(
        starCountRef.value,
        {
          scale: 0,
          width: 0,
          opacity: 0,
        },
        {
          scale: 1,
          width: "100px",
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1)",
        },
      );
    }
  },
  { immediate: true },
);
</script>
