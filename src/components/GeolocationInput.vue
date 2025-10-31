<template>
  <section>
    <h2>Your location</h2>
    <form @submit.prevent>
      <fieldset>
        <button
          id="requestGeolocation"
          :disabled="anyLoading"
          @click="requestGeolocation"
        >
          {{ gpsButtonText }}
        </button>
        <input
          id="text-location"
          type="text"
          placeholder="e.g., Paris, France..."
          v-model="textLocation"
        />
        <button :disabled="anyLoading" @click="submitTextLocation">
          Find my location
        </button>
      </fieldset>
    </form>
    <p v-if="anyError">{{ anyError }}</p>
    <p v-if="anyLoading">Finding location...</p>
    <pre v-if="location">{{ location }}</pre>
  </section>
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
