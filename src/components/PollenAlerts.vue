<template>
  <section>
    <h2>Pollen Alerts</h2>
    <div v-if="isLoading">Loading pollen data...</div>
    <div v-else-if="fetchError" class="error">Error: {{ fetchError }}</div>
    <ul v-else-if="warnings.length">
      <li v-for="(warning, i) in warnings" :key="i">{{ warning }}</li>
    </ul>
    <div v-else>No pollen alerts at this time.</div>
  </section>
</template>

<script setup>
import { usePollenData } from '../composables/usePollenData';
import { usePollenAlerts } from '../composables/usePollenAlerts';

const { parsedData, isLoading, fetchError } = usePollenData();
const warnings = usePollenAlerts(parsedData);
</script>
