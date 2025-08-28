<script setup>
import SneezePrediction from '../components/SneezePrediction.vue';
import SneezeChart from '../components/SneezeChart.vue';
import SneezeLogger from '../components/SneezeLogger.vue';
import SneezeMatrix from '../components/SneezeMatrix.vue';
import PollenAlerts from '../components/PollenAlerts.vue';
import PollenChart from '../components/PollenChart.vue';
</script>

<template>
  <div>
    <SneezePrediction />
    <PollenAlerts />
    <SneezeLogger />
    <PollenChart />
    <SneezeChart />
    <SneezeMatrix />
  </div>
</template>
