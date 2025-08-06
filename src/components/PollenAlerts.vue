<!-- PollenAlerts.vue -->
<template>
  <section>
    <h2>Pollen Alerts</h2>
    <div v-if="isLoading">Loading pollen data...</div>
    <div v-else-if="fetchError" class="error">Error: {{ fetchError }}</div>
    <ul v-else-if="groupedAlerts.length">
      <li v-for="(group, i) in groupedAlerts" :key="i">
        ⏰ {{ group.timeRange }} {{ pollenEmoji }} High Pollen:
        {{ group.pollenInfo }}
      </li>
    </ul>
    <div v-else>No pollen alerts at this time.</div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { usePollenData } from '../composables/usePollenData';
import { usePollenAlerts } from '../composables/usePollenAlerts';
import { useGroupedPollenAlerts } from '../composables/useGroupedPollenAlerts';

const { parsedData, isLoading, fetchError } = usePollenData();
const alerts = usePollenAlerts(parsedData);
const groupedAlerts = useGroupedPollenAlerts(alerts);

const pollenEmoji = '🌿';
</script>
