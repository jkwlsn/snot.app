<template>
  <form @submit.prevent>
    <fieldset class="flex">
      <button
        id="requestGeolocation"
        :disabled="anyLoading"
        @click="requestGeolocation"
        class="p-2 me-4 bg-purple-300 rounded-lg hover:bg-purple-500 hover:text-white hover:cursor-pointer"
      >
        {{ gpsButtonText }}
      </button>
      <input
        id="text-location"
        type="text"
        placeholder="e.g., Paris, France..."
        v-model="locationQuery"
        class="flex-grow ps-2 bg-white rounded-s-lg"
      />
      <button
        :disabled="anyLoading"
        @click="searchLocationByName(locationQuery)"
        class="p-2 bg-purple-300 rounded-e-lg hover:bg-purple-500 hover:text-white hover:cursor-pointer"
      >
        Find my location
      </button>
    </fieldset>
  </form>
  <p v-if="anyError">{{ anyError }}</p>
  <p v-if="anyLoading">Finding location...</p>
  <Pre v-if="location"
    ><template #content>{{ location }}</template></Pre
  >
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useGeolocation } from "../composables/useGeolocation";
import Pre from "./Pre.vue";

const {
  gpsButtonText,
  confirmedLocationName,
  location,
  anyLoading,
  anyError,
  searchLocationByName,
  requestGeolocation,
} = useGeolocation();

const locationQuery = ref(confirmedLocationName.value);

watch(confirmedLocationName, (newValue) => {
  locationQuery.value = newValue;
});
</script>