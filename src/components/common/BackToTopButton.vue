<template>
  <button :class="['back-to-top', { visible }]" @click="visible && scrollToTop()">
    <i class="pi pi-arrow-up" style="color: #fff; font-size: 1rem"></i>
    返回顶部
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const visible = ref(false);

const messages = [
  "🐴  Country roads, take me home!",
  "🚀  To infinity and beyond!",
  "🦾  Get to the choppa!",
  "🚕  Grove Street, home...",
  "🐉  Fus Ro Dah!",
  "🍄  The princess is in another castle!",
  "🦸‍♂️  Avengers, assemble!",
  "🗡️  It's dangerous to go alone! Take this.",
  "📜  A wizard is never late.",
  "💍  Foul Tarnished, in search of the Elden Ring!",
  "🐊  See you later, alligator.",
  "🔥  Dracarys!",
];

const getRandomMessage = (messages: string[]) =>
  messages[Math.floor(Math.random() * messages.length)];

const scrollToTop = () => {
  window.scrollTo(0, 0);
  toast.add({
    severity: "secondary",
    summary: getRandomMessage(messages),
    life: 3000,
  });
};

const onScroll = () => {
  visible.value = window.scrollY > 500;
};

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>
