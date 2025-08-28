<template>
  <section
    class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">
      Pollen Data
    </h2>
    <p v-if="isLoading" class="text-center text-gray-700 mb-2 font-medium">
      Loading pollen data...
    </p>
    <p v-else-if="fetchError" class="text-center text-red-600 mb-2 font-medium">
      Error: {{ fetchError }}
    </p>
    <pre
      v-else-if="parsedData"
      class="text-gray-700 bg-gray-100 p-2 rounded-md overflow-auto text-sm"
      >{{ JSON.stringify(parsedData, null, 2) }}</pre
    >
  </section>
</template>

<script setup>
import { usePollenData } from '../composables/usePollenData';

const { parsedData, isLoading, fetchError } = usePollenData();
</script>
