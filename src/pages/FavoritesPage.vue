<template>
  <main class="app-container">
    <Header />

    <section class="category-wrapper">
      <Sidebar />

      <div class="category-page"></div>
    </section>
  </main>
</template>

<script setup lang="ts">
import Header from '@/components/navs/Header.vue';
import Sidebar from '@/components/navs/Sidebar.vue';
</script>
