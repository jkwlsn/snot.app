<script setup>
import PollenSelector from './PollenSelector.vue';
import GeoLocation from './GeoLocation.vue';
import PollenData from './PollenData.vue';
import PollenAlerts from './PollenAlerts.vue';
</script>

<template>
  <main>
    <PollenSelector />
    <GeoLocation />
    <PollenAlerts />
    <PollenData />
  </main>
</template>
