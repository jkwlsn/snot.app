<template>
  <section>
    <h2>Pollen Data</h2>
    <div v-if="noLocation">
      <p>Set location to view pollen data</p>
    </div>
    <div v-else>
      <div v-if="loading">
        <p>Loading data...</p>
      </div>
      <div v-else-if="error">
        <p>Error: {{ error.message }}</p>
      </div>
      <div v-else-if="data">
        <h3>
          Showing data for: {{ textLocation }} (Latitude:
          {{ location?.latitude }}, Longitude: {{ location?.longitude }})
        </h3>
        <pre>{{ JSON.stringify(data.hourly, null, 2) }}</pre>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useOpenMeteoAPI } from "../composables/useOpenMeteo";
import { useGeolocation } from "../composables/useGeolocation";
import { OpenMeteoAPIParams } from "../interfaces/openmeteoapiparams";

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
        openMeteoFetch({
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
        } as OpenMeteoAPIParams);
      }
    }
  },
  { immediate: true },
);
</script>
