<template>
  <section>
    <h2>Location</h2>
    <p v-if="loading">Getting location...</p>
    <p v-else-if="error">{{ error }}</p>
    <p v-else-if="isGeolocationEnabled">
      Current location: {{ coords.latitude.toFixed(4) }},
      {{ coords.longitude.toFixed(4) }}
    </p>
    <button
      @click="requestLocation"
      :disabled="loading"
      class="clear-button border rounded p-1 cursor-pointer hover:text-red-400"
    >
      Refresh Location
    </button>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useGeoLocation } from '../composables/useGeoLocation';

const { coords, isGeolocationEnabled, loading, error, requestLocation } = useGeoLocation();

onMounted(() => {
  if (!isGeolocationEnabled.value) {
    requestLocation();
  }
});
</script>
