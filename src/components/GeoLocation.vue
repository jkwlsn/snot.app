<template>
  <section>
    <h2>Location</h2>

    <p v-if="loading">Getting location...</p>

    <p v-else-if="error" class="error">
      {{ error }}
      <br />
      Please enable location access in your browser settings.
    </p>

    <p v-else-if="location">
      Latitude: {{ location.latitude }}
      <br />
      Longitude: {{ location.longitude }}
    </p>
  </section>
</template>

<script setup>
import { useGeoLocation } from '../composables/useGeoLocation';

const { location, loading, error } = useGeoLocation();
</script>
