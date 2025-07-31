<script setup>
import { usePollenData } from '../composables/usePollenData';

const { parsedData, isLoading, fetchError } = usePollenData();
</script>

<template>
  <section v-if="isLoading">
    <h2>Pollen Data</h2>
    <p>Loading pollen data...</p>
  </section>
  <section v-else-if="fetchError">
    <h2>Pollen Data</h2>
    <p class="error">Error: {{ fetchError }}</p>
  </section>
  <section v-else-if="parsedData">
    <h2>Pollen Data</h2>
    <pre>{{ JSON.stringify(parsedData, null, 2) }}</pre>
  </section>
</template>
