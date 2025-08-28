<template>
  <section
    class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Location</h2>
    <p v-if="loading" class="text-center text-gray-700 mb-2 font-medium">
      Getting location...
    </p>
    <p v-else-if="error" class="text-center text-red-600 mb-2 font-medium">
      {{ error }}
    </p>
    <p v-else-if="isGeolocationEnabled" class="text-center text-gray-700 mb-2">
      Current location: {{ coords.latitude.toFixed(4) }},
      {{ coords.longitude.toFixed(4) }}
    </p>
    <button
      @click="requestLocation"
      :disabled="loading"
      class="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-75 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4 w-full"
    >
      Refresh Location
    </button>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useGeoLocation } from '../composables/useGeoLocation';

const { coords, isGeolocationEnabled, loading, error, requestLocation } =
  useGeoLocation();

onMounted(() => {
  if (!isGeolocationEnabled.value) {
    requestLocation();
  }
});
</script>
