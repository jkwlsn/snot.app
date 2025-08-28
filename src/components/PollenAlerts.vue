<template>
  <section class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Pollen Alerts</h2>
    <div v-if="isLoading" class="text-center text-gray-700 mb-2 font-medium ">pollen data...</div>
    <div v-else-if="fetchError" class="text-center text-red-600 mb-2 font-medium">Error: {{ fetchError }}</div>
    <ul v-else-if="groupedAlerts.length" class="text-gray-700 divide-y divide-gray-200">
      <li v-for="(group, i) in groupedAlerts" :key="i" class="py-2">
        ⏰ {{ group.timeRange }} {{ pollenEmoji }} High Pollen:
        {{ group.pollenInfo }}
      </li>
    </ul>
    <div v-else class="text-center text-gray-500 mb-2 italic">No pollen alerts at this time.</div>
  </section>
</template>

<script setup>
import { usePollenData } from '../composables/usePollenData';
import { usePollenAlerts } from '../composables/usePollenAlerts';
import { useGroupedPollenAlerts } from '../composables/useGroupedPollenAlerts';

const { parsedData, isLoading, fetchError } = usePollenData();
const alerts = usePollenAlerts(parsedData);
const groupedAlerts = useGroupedPollenAlerts(alerts);

const pollenEmoji = '🌿';
</script>
