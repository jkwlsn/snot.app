<template>
  <section
    class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Location</h2>
    <p v-if="loading" class="text-center text-gray-700 mb-2 font-medium">
      Getting location...
    </p>
    <p v-else-if="error && !isManualLocationActive" class="text-center text-red-600 mb-2 font-medium">
      {{ error }}
    </p>
    <p v-else-if="coords" class="text-center text-gray-700 mb-2">
      <span class="font-semibold">{{ isManualLocationActive ? 'Manual' : 'Auto-detected' }} Location:</span>
      {{ activeAddress || `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` }}
    </p>

    <!-- Location Mode Toggle -->
    <div class="flex justify-center items-center space-x-4 mt-4 mb-6">
      <span class="text-gray-700 font-medium">Auto-Detect Location</span>
      <label
        for="location-toggle"
        class="relative inline-flex items-center cursor-pointer"
      >
        <input
          type="checkbox"
          id="location-toggle"
          class="sr-only peer"
          :checked="isManualLocationActive"
          @change="handleToggleManualLocation"
          :disabled="loading"
        />
        <div
          class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
        ></div>
      </label>
      <span class="text-gray-700 font-medium">Manual Location</span>
    </div>

    <!-- Manual Location Input -->
    <div v-if="isManualLocationActive" class="mt-4">
      <h3 class="text-lg font-semibold text-gray-700 mb-2">Set Manual Location</h3>
      <input
        type="text"
        v-model="manualLocationInput"
        placeholder="Enter city, address, or coordinates"
        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2"
        @keyup.enter="setManualLocation"
      />
      <p v-if="error && isManualLocationActive" class="text-red-600 text-sm mb-2">{{ error }}</p>
      <button
        @click="setManualLocation"
        :disabled="!manualLocationInput.trim() || loading"
        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full"
      >
        Set Manual Location
      </button>
    </div>

    <!-- Auto-Detect Location Button -->
    <button
      v-else
      @click="requestLocation"
      :disabled="loading"
      class="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-75 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4 w-full"
    >
      {{ loading ? 'Detecting...' : 'Auto-Detect My Location' }}
    </button>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useGeoLocation } from '../composables/useGeoLocation';

const {
  coords,
  activeAddress,
  manualAddress,
  isGeolocationEnabled,
  isManualLocationActive,
  loading,
  error,
  requestLocation,
  setManualLocationCoords,
  toggleManualLocation,
} = useGeoLocation();

const manualLocationInput = ref('');

// Basic debounce utility
const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

// Debounced version of setManualLocationCoords
const debouncedSetManualLocation = debounce(async (address) => {
  if (address.trim()) {
    await setManualLocationCoords(address);
  }
}, 800); // 800ms debounce delay

// Watch for changes in manualLocationInput and trigger debounced geocoding
watch(manualLocationInput, (newVal) => {
  if (isManualLocationActive.value) {
    debouncedSetManualLocation(newVal);
  }
});

// Initialize manualLocationInput if manual location is active
watch(isManualLocationActive, (newVal) => {
  if (newVal && manualAddress.value) {
    manualLocationInput.value = manualAddress.value;
  } else if (!newVal) {
    manualLocationInput.value = ''; // Clear input when switching to auto-detect
  }
}, { immediate: true });

const setManualLocation = async () => {
  if (manualLocationInput.value.trim()) {
    await setManualLocationCoords(manualLocationInput.value);
  }
};

const handleToggleManualLocation = () => {
  toggleManualLocation();
};

onMounted(() => {
  // Only request auto-location if no manual location is active and no auto-location is already set
  if (!isManualLocationActive.value && !coords.value) {
    requestLocation();
  }
});