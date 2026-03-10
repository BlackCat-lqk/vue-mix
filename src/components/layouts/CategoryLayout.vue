<template>
  <main class="app-container">
    <Header />

    <section class="category-wrapper">
      <Sidebar />

      <div class="category-page">
        <router-view />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import Header from '../navs/Header.vue';
import Sidebar from '../navs/Sidebar.vue';
</script>
