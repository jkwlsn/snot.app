<template>
  <form @submit.prevent>
    <fieldset class="flex">
      <button
        id="requestGeolocation"
        :disabled="anyLoading"
        @click="handleGpsSearch"
        class="p-2 me-4 bg-purple-300 rounded-lg hover:bg-purple-500 hover:text-white hover:cursor-pointer"
      >
        {{ gpsLocationButtonText }}
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
        {{ manualLocationButtonText }}
      </button>
    </fieldset>
  </form>
  <p v-if="anyError">{{ anyError }}</p>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useGeolocation } from "../composables/useGeolocation";

type LocationSource = "NONE" | "GPS" | "MANUAL";

const {
  confirmedLocationName,
  anyLoading,
  anyError,
  searchLocationByName,
  requestGeolocation,
} = useGeolocation();

const gpsLocationButtonText = ref<"Use GPS" | "GPS loading..." | "Refresh GPS">(
  "Use GPS",
);
const manualLocationButtonText = ref<
  "Find my location" | "Finding location..." | "Location found"
>("Find my location");
const locationQuery = ref("");
const locationSource = ref<LocationSource>("NONE");

const isLocationConfirmed = computed(
  () =>
    locationSource.value !== "NONE" &&
    !!locationQuery.value &&
    locationQuery.value === confirmedLocationName.value,
);

async function handleManualSearch() {
  locationSource.value = "MANUAL";
  manualLocationButtonText.value = "Finding location...";
  await searchLocationByName(locationQuery.value);
}

function handleGpsSearch() {
  locationSource.value = "GPS";
  gpsLocationButtonText.value = "GPS loading...";
  requestGeolocation();
}



watch(locationQuery, (newQuery) => {
  if (newQuery !== confirmedLocationName.value) {
    locationSource.value = "NONE";
    gpsLocationButtonText.value = "Use GPS";
    manualLocationButtonText.value = "Find my location";
  }
});

watch(confirmedLocationName, (newValue) => {
  if (newValue) {
    if (locationSource.value === "GPS") {
      locationQuery.value = newValue;
      gpsLocationButtonText.value = "Refresh GPS";
      manualLocationButtonText.value = "Find my location";
    } else if (locationSource.value === "MANUAL") {
      locationQuery.value = newValue;
      manualLocationButtonText.value = "Location found";
      gpsLocationButtonText.value = "Use GPS";
    }
  }
});

watch(anyError, (newError) => {
  if (newError) {
    locationSource.value = "NONE";
    gpsLocationButtonText.value = "Use GPS";
    manualLocationButtonText.value = "Find my location";
  }
});
</script>
