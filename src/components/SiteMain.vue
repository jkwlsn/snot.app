<script setup>
import { ref } from 'vue';
import PollenSensitivity from './PollenSensitivity.vue';
import GeoLocation from './GeoLocation.vue';

const sensitivity = ref(5);
const location = ref(null);
</script>

<template>
  <main>
    <PollenSensitivity v-model="sensitivity" />
    <GeoLocation v-model:location="location" />
  </main>
</template>
