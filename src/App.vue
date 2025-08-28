<script setup>
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <main class="flex-grow p-4 md:p-8 text-gray-900">
      <router-view />
    </main>
    <SiteFooter />
  </div>
</template>
