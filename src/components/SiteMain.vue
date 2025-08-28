<script setup>
import SneezePrediction from './SneezePrediction.vue';
import SneezeChart from './SneezeChart.vue';
import PollenSelector from './PollenSelector.vue';
import SneezeHistory from './SneezeHistory.vue';
import SneezeLogger from './SneezeLogger.vue';
import SneezeMatrix from './SneezeMatrix.vue';
import GeoLocation from './GeoLocation.vue';
import PollenData from './PollenData.vue';
import PollenAlerts from './PollenAlerts.vue';
import PollenChart from './PollenChart.vue';
</script>

<template>
  <main class="flex-grow p-4 md:p-8 text-gray-900">
    <GeoLocation />
    <PollenSelector />
    <SneezePrediction />
    <PollenChart />
    <PollenAlerts />
    <SneezeLogger />
    <SneezeHistory />
    <SneezeChart />
    <SneezeMatrix />
    <PollenData />
  </main>
</template>
