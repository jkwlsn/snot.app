<template>
  <form @submit.prevent>
    <fieldset class="flex">
      <button
        id="requestGeolocation"
        :disabled="anyLoading"
        @click="handleGpsSearch"
        class="p-2 me-4 bg-purple-300 rounded-lg hover:bg-purple-500 hover:text-white hover:cursor-pointer"
      >
        {{ gpsButtonText }}
      </button>
      <input
        id="text-location"
        type="text"
        placeholder="e.g., Paris, France..."
        v-model="locationQuery"
        class="flex-grow ps-2 rounded-s-lg"
        :class="isLocationConfirmed ? 'bg-white' : 'bg-amber-100'"
      />
      <button
        :disabled="anyLoading"
        @click="handleManualSearch"
        class="p-2 bg-purple-300 rounded-e-lg hover:bg-purple-500 hover:text-white hover:cursor-pointer"
      >
        {{ manualButtonText }}
      </button>
    </fieldset>
  </form>
  <p v-if="anyError">{{ anyError }}</p>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useGeolocation } from "../composables/useGeolocation";

const {
  confirmedLocationName,
  anyLoading,
  isLoadingGps,
  isLoadingManual,
  anyError,
  requestGpsLocation,
  searchManualLocation,
} = useGeolocation();

const locationQuery = ref("");

if (confirmedLocationName.value) {
  locationQuery.value = confirmedLocationName.value;
}

const isLocationConfirmed = computed(
  () =>
    !!locationQuery.value &&
    locationQuery.value === confirmedLocationName.value,
);

const gpsButtonText = computed(() => {
  if (isLoadingGps.value) {
    return "GPS loading...";
  } else if (
    confirmedLocationName.value &&
    locationQuery.value === confirmedLocationName.value
  ) {
    return "Refresh GPS";
  }
  return "Use GPS";
});

const manualButtonText = computed(() => {
  if (isLoadingManual.value) {
    return "Finding location...";
  } else if (
    confirmedLocationName.value &&
    locationQuery.value === confirmedLocationName.value
  ) {
    return "Location found";
  }
  return "Find my location";
});

async function handleManualSearch() {
  if (locationQuery.value) {
    await searchManualLocation(locationQuery.value);
  }
}

function handleGpsSearch() {
  requestGpsLocation();
}

watch(confirmedLocationName, (newValue) => {
  if (newValue && newValue !== locationQuery.value) {
    locationQuery.value = newValue;
  }
});

watch(anyError, (newError) => {
  if (newError) {
    locationQuery.value = "";
  }
});
</script>
