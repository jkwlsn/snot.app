import { ref, computed, type Ref } from "vue";
import { useNominatim } from "./useNominatim";
import type { Coordinates } from "../interfaces/Coordinates";

const nominatim = useNominatim();

const gpsButtonText = ref<"Use GPS" | "Refresh GPS">("Use GPS");
const confirmedLocationName = ref<string>("");
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

const searchLocationByName = async (query: string): Promise<void> => {
  location.value = null;
  errorMessage.value = null;

  try {
    const newLocation = await nominatim.forwardGeocode(query);
    if (newLocation === null) {
      throw new Error("Could not get location");
    }
    location.value = newLocation;
    confirmedLocationName.value = query;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("searchLocationByName failed:", error.message);
    } else {
      const unknownErrorString = String(error);
      console.error(
        "searchLocationByName failed: An unknown error occurred.",
        unknownErrorString,
      );
    }
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
  void reverseGeocode(newLocation);

  isLoading.value = false;
  gpsButtonText.value = "Refresh GPS";
};

const reverseGeocode = async (coordinates: Coordinates): Promise<void> => {
  const resultText = await nominatim.reverseGeocode(coordinates);
  confirmedLocationName.value = resultText ?? "";
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

export const useGeolocation = (): {
  gpsButtonText: Ref<"Use GPS" | "Refresh GPS">;
  confirmedLocationName: Ref<string>;
  location: Ref<Coordinates | null>;
  anyLoading: Ref<boolean>;
  anyError: Ref<string | null>;
  searchLocationByName: (query: string) => Promise<void>;
  requestGeolocation: () => void;
} => {
  return {
    gpsButtonText,
    confirmedLocationName,
    location,
    anyLoading,
    anyError,
    searchLocationByName,
    requestGeolocation,
  };
};
