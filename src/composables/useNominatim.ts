import { ref, type Ref } from "vue";
import type { Coordinates } from "../interfaces/Coordinates";
import type { NominatimForwardResult } from "../interfaces/NominatimForwardResult";
import type { NominatimReverseResult } from "../interfaces/NominatimReverseResult";

interface NominatimState {
  isLoading: boolean;
  errorMessage: string | null;
}

const nominatimState = ref<NominatimState>({
  isLoading: false,
  errorMessage: null,
});

const forwardGeocode = async (query: string): Promise<Coordinates | null> => {
  nominatimState.value.isLoading = true;
  nominatimState.value.errorMessage = null;

  if (query.trim() === "") {
    nominatimState.value.isLoading = false;
    nominatimState.value.errorMessage = "Please enter a location";
    return null;
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`${response.status.toString()}: ${response.statusText}`);
    }

    const data = (await response.json()) as NominatimForwardResult[];

    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } else {
      throw new Error(`Could not find coordinates for "${query}".`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("forwardGeocode failed:", error.message);
      nominatimState.value.errorMessage = error.message;
    } else {
      const unknownErrorString = String(error);
      console.error("forwardGeocode failed: An unknown error occurred.", unknownErrorString);
      nominatimState.value.errorMessage = `An unknown error occurred: ${unknownErrorString}`;
    }
    return null;
  } finally {
    nominatimState.value.isLoading = false;
  }
};

const reverseGeocode = async (
  coordinates: Coordinates,
): Promise<string | null> => {
  nominatimState.value.isLoading = true;
  nominatimState.value.errorMessage = null;

  try {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${coordinates.latitude.toString()}&lon=${coordinates.longitude.toString()}&format=geocodejson&addressdetails=1`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`${response.status.toString()}: ${response.statusText}`);
    }

    const data = (await response.json()) as NominatimReverseResult;

    const result = data.features[0].properties.geocoding;
    const district: string = result.district;
    const city: string = result.city ?? result.town ?? result.village ?? "";
    const country: string = result.country;

    return `${district}, ${city}, ${country}`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("reverseGeocode failed:", error.message);
      nominatimState.value.errorMessage = error.message;
    } else {
      const unknownErrorString = String(error);
      console.error("reverseGeocode failed: An unknown error occurred.", unknownErrorString);
      nominatimState.value.errorMessage = `An unknown error occurred: ${unknownErrorString}`;
    }
    return null;
  } finally {
    nominatimState.value.isLoading = false;
  }
};

export function useNominatim(): {
  nominatimState: Ref<NominatimState>;
  forwardGeocode: (query: string) => Promise<Coordinates | null>;
  reverseGeocode: (coordinates: Coordinates) => Promise<string | null>;
} {
  return {
    nominatimState,
    forwardGeocode,
    reverseGeocode,
  };
}
