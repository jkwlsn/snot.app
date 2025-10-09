<template>
  <form @submit.prevent>
    <fieldset>
      <input
        type="text"
        placeholder="e.g., Paris, France..."
        v-model="textLocation"
      />
      <button :disabled="isLoading" @click="submitTextLocation">
        Find my location
      </button>
    </fieldset>
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

const gpsButtonText = ref<"Use GPS" | "Refresh GPS">("Use GPS");
const textLocation = ref<string>("");
const location = ref<Location | null>(null);
const errorMessage = ref<string | null>(null);
const isLoading = ref<boolean>(false);

const reverseGeocodeCoordinates = async () => {
  isLoading.value = true;

  try {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${location.value?.latitude}&lon=${location.value?.longitude}&format=geocodejson&addressdetails=1`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();

    console.log(data);
    const feature = data.features?.[0];

    if (feature && feature.properties?.geocoding) {
      const geocoding = feature.properties.geocoding;
      const district: string = geocoding.district;
      const city = geocoding.city || geocoding.town || geocoding.village;
      const country = geocoding.country;

      textLocation.value = `${district}, ${city}, ${country}`;
    } else {
      throw new Error(
        `Could not find location for ${location.value?.latitude}, ${location.value?.longitude}`,
      );
    }
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

const submitTextLocation = async () => {
  if (textLocation.value.trim() === "") {
    errorMessage.value = "Please enter a location";
    return;
  }
  isLoading.value = true;
  location.value = null;

  try {
    const encodedQuery = encodeURIComponent(textLocation.value);
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();

    if (data && data.length > 0) {
      location.value = {
        latitude: data[0].lat,
        longitude: data[0].lon,
      };
    } else {
      throw new Error(
        `Could not find coordinates for "${textLocation.value}".`,
      );
    }
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    gpsButtonText.value = "Use GPS";
    isLoading.value = false;
  }
};

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
  reverseGeocodeCoordinates();
  gpsButtonText.value = "Refresh GPS";
  textLocation.value = "";
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
