<template>
  <header class="text-center p-4">
    <h1>{{ title }}</h1>
    <nav>
      <router-link to="/" class="p-2">Dashboard</router-link>
      <router-link to="/data" class="p-2">Data</router-link>
      <router-link to="/settings" class="p-2">Settings</router-link>
    </nav>
  </header>
</template>

<script setup>
const title = 'snot.app';
</script>
