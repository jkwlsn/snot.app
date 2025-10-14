import { ref, computed } from "vue";
import { useNominatim } from "./useNominatim";
import type { Coordinates } from "../interfaces/Coordinates";

const nominatim = useNominatim();

const gpsButtonText = ref<"Use GPS" | "Refresh GPS">("Use GPS");
const textLocation = ref<string>("");
const location = ref<Coordinates | null>(null);
const errorMessage = ref<string | null>(null);
const isLoading = ref<boolean>(false);

const anyLoading = computed(
  () => isLoading.value || nominatim.nominatimState.value.isLoading,
);

const anyError = computed(
  () =>
    errorMessage.value ?? nominatim.nominatimState.value.errorMessage ?? null,
);

const submitTextLocation = async (): Promise<void> => {
  location.value = null;
  errorMessage.value = null;

  try {
    const newLocation = await nominatim.forwardGeocode(textLocation.value);
    if (newLocation === null) {
      throw new Error("Could not get location");
    }
    location.value = newLocation;
  } catch (error: unknown) {
    console.error(error as Error);
  }
  gpsButtonText.value = "Use GPS";
};

const requestGeolocation = (): void => {
  isLoading.value = true;
  errorMessage.value = null;
  location.value = null;

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    errorMessage.value = "Geolocation is not available";
    isLoading.value = false;
  }
};

const success = (position: GeolocationPosition): void => {
  const newLocation: Coordinates = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
  location.value = newLocation;
  reverseGeocode(newLocation);

  isLoading.value = false;
  gpsButtonText.value = "Refresh GPS";
};

const reverseGeocode = async (coordinates: Coordinates): Promise<void> => {
  const resultText = await nominatim.reverseGeocode(coordinates);
  textLocation.value = resultText ?? "";
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

export const useGeolocation = () => {
  return {
    gpsButtonText,
    textLocation,
    location,
    anyLoading,
    anyError,
    submitTextLocation,
    requestGeolocation,
  };
};
