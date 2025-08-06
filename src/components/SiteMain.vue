<script setup>
import PollenSensitivity from './PollenSensitivity.vue';
import PollenSelector from './PollenSelector.vue';
import GeoLocation from './GeoLocation.vue';
import PollenData from './PollenData.vue';
import PollenAlerts from './PollenAlerts.vue';
</script>

<template>
  <main>
    <PollenSensitivity />
    <PollenSelector />
    <GeoLocation />
    <PollenAlerts />
    <PollenData />
  </main>
</template>
