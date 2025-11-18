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
  anyError,
  searchLocationByName,
  requestGeolocation,
} = useGeolocation();

const locationQuery = ref("");
const gpsButtonText = ref<"Use GPS" | "GPS loading..." | "Refresh GPS">(
  "Use GPS",
);
const manualButtonText = ref<
  "Find my location" | "Finding location..." | "Location found"
>("Find my location");

const isLocationConfirmed = computed(
  () =>
    !!locationQuery.value &&
    locationQuery.value === confirmedLocationName.value,
);

async function handleManualSearch() {
  manualButtonText.value = "Finding location...";
  await searchLocationByName(locationQuery.value);

  if (anyError.value) {
    manualButtonText.value = "Find my location";
  } else {
    manualButtonText.value = "Location found";
  }
}

function handleGpsSearch() {
  gpsButtonText.value = "GPS loading...";
  requestGeolocation();
}

watch(locationQuery, (newQuery) => {
  if (newQuery !== confirmedLocationName.value) {
    manualButtonText.value = "Find my location";
  }
});

watch(confirmedLocationName, (newValue) => {
  if (newValue) {
    locationQuery.value = newValue;
    gpsButtonText.value = "Refresh GPS";
    manualButtonText.value = "Location found";
  }
});

watch(anyError, (newError) => {
  if (newError) {
    gpsButtonText.value = "Use GPS";
    manualButtonText.value = "Find my location";
  }
});
</script>
