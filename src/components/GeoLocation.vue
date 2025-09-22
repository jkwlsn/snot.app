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
    <p
      v-else-if="isManualLocationActive && coords"
      class="text-center text-gray-700 mb-2"
    >
      Manual location: {{ coords.latitude.toFixed(4) }},
      {{ coords.longitude.toFixed(4) }}
    </p>
    <p
      v-else-if="isGeolocationEnabled && coords"
      class="text-center text-gray-700 mb-2"
    >
      Auto-detected location: {{ coords.latitude.toFixed(4) }},
      {{ coords.longitude.toFixed(4) }}
    </p>

    <!-- Manual Location Input -->
    <div class="mt-4">
      <h3 class="text-lg font-semibold text-gray-700 mb-2">Set Manual Location</h3>
      <input
        type="text"
        v-model="manualLocationInput"
        placeholder="Enter city or address"
        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2"
        @keyup.enter="setManualLocation"
      />
      <button
        @click="setManualLocation"
        :disabled="!manualLocationInput.trim() || loading"
        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75 transition-colors duration-200 w-full"
      >
        Set Manual Location
      </button>
    </div>

    <button
      @click="requestLocation"
      :disabled="loading"
      class="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-75 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4 w-full"
    >
      Refresh Auto-Detect Location
    </button>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useGeoLocation } from '../composables/useGeoLocation';

const { coords, isGeolocationEnabled, isManualLocationActive, loading, error, requestLocation, setManualLocationCoords } =
  useGeoLocation();

const manualLocationInput = ref('');

const setManualLocation = async () => {
  if (manualLocationInput.value.trim()) {
    await setManualLocationCoords(manualLocationInput.value);
  }
};

onMounted(() => {
  // Only request auto-location if no manual location is active and no auto-location is already set
  if (!isManualLocationActive.value && !coords.value) {
    requestLocation();
  }
});
</script>
