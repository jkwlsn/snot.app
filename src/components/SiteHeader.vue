<template>
  <header class="bg-emerald-200 rounded-lg p-2 m-5 flex justify-between">
    <h1 class="p-2">{{ title }}</h1>
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
    </nav>
  </header>
</template>

<script setup>
const title = 'snot.app';
</script>
