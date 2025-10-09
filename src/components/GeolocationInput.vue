<template>
  <form @submit.prevent>
    <fieldset>
      <button
        id="requestGeolocation"
        :disabled="isLoading"
        @click="requestGeolocation"
      >
        {{ gpsButtonText }}
      </button>
    </fieldset>
  </form>
  <p v-if="errorMessage">{{ errorMessage }}</p>
  <p v-if="isLoading">Finding location...</p>
  <div v-if="location">
    <p>Latitude: {{ location.latitude }}</p>
    <p>Longitude: {{ location.longitude }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Location {
  latitude: number;
  longitude: number;
}

const gpsButtonText = ref<string>("Use GPS");
const location = ref<Location | null>(null);
const errorMessage = ref<string | null>(null);
const isLoading = ref<boolean>(false);

const requestGeolocation = (): void => {
  isLoading.value = true;
  errorMessage.value = null;

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    errorMessage.value = "Geolocation is not available";
    isLoading.value = false;
  }
};

const success = (position: GeolocationPosition): void => {
  location.value = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
  gpsButtonText.value = "Refresh GPS";
  isLoading.value = false;
};

const error = (err: GeolocationPositionError): void => {
  isLoading.value = false;
  switch (err.code) {
    case err.PERMISSION_DENIED:
      errorMessage.value = "User denied the request for Geolocation.";
      break;
    case err.POSITION_UNAVAILABLE:
      errorMessage.value = "Location information is unavailable.";
      break;
    case err.TIMEOUT:
      errorMessage.value = "The request to get user location timed out.";
      break;
    default:
      errorMessage.value = "An unknown error occurred.";
  }
};

</script>
