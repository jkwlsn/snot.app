<template>
  <section>
    <h2>Pollen Data</h2>
    <p v-if="noLocation">Set location to view pollen data</p>
    <div v-else>
      <p v-if="loading">Loading data...</p>
      <p v-else-if="error">Error: {{ error.message }}</p>
      <div v-else-if="data">
        <strong>
          Showing data for: {{ textLocation }} (Latitude:
          {{ location?.latitude }}, Longitude: {{ location?.longitude }})
        </strong>
      </div>
      <p v-if="data?.records.length == 0">No data</p>
      <pre v-else>{{ JSON.stringify(data?.records, null, 2) }}</pre>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useGeolocation } from "../composables/useGeolocation";
import { useOpenMeteoAPI } from "../composables/useOpenMeteo";
import type { OpenMeteoAPIParams } from "../interfaces/openmeteoapiparams";

const { textLocation, location } = useGeolocation();
const { data, loading, error, openMeteoFetch } = useOpenMeteoAPI();

const noLocation = computed(() => location.value === null);

watch(
  location,
  (newLocation) => {
    if (newLocation) {
      if (
        !data.value ||
        data.value.latitude !== newLocation.latitude ||
        data.value.longitude !== newLocation.longitude
      ) {
        void openMeteoFetch({
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
        } as OpenMeteoAPIParams);
      }
    }
  },
  { immediate: true },
);
</script>
