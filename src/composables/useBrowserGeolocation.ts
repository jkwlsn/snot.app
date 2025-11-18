import { type Ref, ref } from "vue";
import { type Coordinates } from "../interfaces/Coordinates";

export function useBrowserGeolocation(): {
  coordinates: Ref<Coordinates | null>;
  errorMessage: Ref<string | null>;
  loading: Ref<boolean>;
  requestGeolocation: () => void;
} {
  const coordinates = ref<Coordinates | null>(null);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  const requestGeolocation = (): void => {
    loading.value = true;
    errorMessage.value = "";

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(success, handleGeolocationError);
    } else {
      errorMessage.value = "Geolocation is not available";
      loading.value = false;
    }
  };

  const success = (location: GeolocationPosition): void => {
    coordinates.value = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    loading.value = false;
  };

  const handleGeolocationError = (err: GeolocationPositionError): void => {
    loading.value = false;
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

  return { coordinates, errorMessage, loading, requestGeolocation };
}
