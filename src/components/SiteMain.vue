<script setup>
import SneezePrediction from './SneezePrediction.vue';
import PollenSelector from './PollenSelector.vue';
import PollenChart from './PollenChart.vue';
import SneezeHistory from './SneezeHistory.vue';
import SneezeLogger from './SneezeLogger.vue';
import SneezeChart from './SneezeChart.vue';
import GeoLocation from './GeoLocation.vue';
import PollenData from './PollenData.vue';
import PollenAlerts from './PollenAlerts.vue';
</script>

<template>
  <main>
    <SneezePrediction />
    <PollenSelector />
    <GeoLocation />
    <PollenAlerts />
    <PollenChart />
    <SneezeLogger />
    <SneezeHistory />
    <SneezeChart />
    <PollenData />
  </main>
</template>
