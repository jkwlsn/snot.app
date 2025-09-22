<template>
  <header
    class="sticky top-5 bg-emerald-200/75 rounded-lg p-2 mt-5 mb-5 flex justify-between backdrop-blur-xs"
  >
    <SneezePrediction />
    <nav class="flex space-x-5">
      <router-link
        to="/"
        class="rounded-md p-2 bg-emerald-300 hover:bg-emerald-400"
      >
        Dashboard
      </router-link>
      <router-link
        to="/data"
        class="rounded-md p-2 bg-emerald-300 hover:bg-emerald-400"
      >
        Data
      </router-link>
      <router-link
        to="/settings"
        class="rounded-md p-2 bg-emerald-300 hover:bg-emerald-400"
      >
        Settings
      </router-link>
      <router-link
        to="/about"
        class="rounded-md p-2 bg-emerald-300 hover:bg-emerald-400"
      >
        About
      </router-link>
    </nav>
  </header>
</template>

<script setup>
import SneezePrediction from '../components/SneezePrediction.vue';
</script>
