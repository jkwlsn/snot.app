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
        v-model="textLocation"
      />
      <button
        :disabled="anyLoading"
        @click="submitTextLocation"
        class="p-2 ms-4 bg-purple-300 rounded-lg hover:bg-purple-500 hover:text-white hover:cursor-pointer"
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
import { useGeolocation } from "../composables/useGeolocation";
import Pre from "./Pre.vue";

const {
  gpsButtonText,
  textLocation,
  location,
  anyLoading,
  anyError,
  submitTextLocation,
  requestGeolocation,
} = useGeolocation();
</script>
