<template>
  <form @submit.prevent>
    <fieldset>
      <input
        type="text"
        placeholder="e.g., Paris, France..."
        v-model="textLocation"
      />
      <button :disabled="anyLoading" @click="submitTextLocation">
        Find my location
      </button>
    </fieldset>
    <fieldset>
      <button
        id="requestGeolocation"
        :disabled="anyLoading"
        @click="requestGeolocation"
      >
        {{ gpsButtonText }}
      </button>
    </fieldset>
  </form>
  <p v-if="anyError">{{ anyError }}</p>
  <p v-if="anyLoading">Finding location...</p>
  <div v-if="location">
    <p>Latitude: {{ location.latitude }}</p>
    <p>Longitude: {{ location.longitude }}</p>
  </div>
</template>

<script setup lang="ts">
import { useGeolocation } from "../composables/useGeolocation";
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
