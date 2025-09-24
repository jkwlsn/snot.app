<script setup>
import SneezeLogger from '../components/SneezeLogger.vue';
import SymptomMatrix from '../components/SymptomMatrix.vue';
import PollenAlerts from '../components/PollenAlerts.vue';
import PollenChart from '../components/PollenChart.vue';
import Symptoms from '../components/Symptoms.vue';
import AllergySuggestions from '../components/AllergySuggestions.vue'; // Import new component
</script>

<template>
  <div>
    <PollenChart />
    <PollenAlerts />
    <SneezeLogger />
    <SymptomMatrix />
    <AllergySuggestions /> <!-- Add new component here -->
    <Symptoms />
  </div>
</template>