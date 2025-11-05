<template>
  <p v-if="noLocation">Set location to view pollen data</p>
  <div v-else>
    <p v-if="loading">Loading data...</p>
    <p v-else-if="error">Error: {{ error.message }}</p>
    <div v-else-if="data">
      <PollenDataTable
        :records="data.records"
        :pollen-types="OPENMETEO_POLLEN_TYPES"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useGeolocation } from "../composables/useGeolocation";
import { useOpenMeteoAPI } from "../composables/useOpenMeteo";
import type { OpenMeteoAPIParams } from "../interfaces/openmeteoapiparams";
import { OPENMETEO_POLLEN_TYPES } from "../config";
import PollenDataTable from "./PollenDataTable.vue";

const { location } = useGeolocation();
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
