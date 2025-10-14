import { ref } from "vue";
import type { Coordinates } from "../interfaces/Coordinates";

interface NominatimSearchResult {
  lat: string;
  lon: string;
}

const nominatimIsLoading = ref<boolean>(false);
const nominatimErrorMessage = ref<string | null>(null);

const forwardGeocode = async (
  query: string,
): Promise<Coordinates | undefined | null> => {
  nominatimIsLoading.value = true;
  nominatimErrorMessage.value = null;

  if (query.trim() === "") {
    nominatimIsLoading.value = false;
    nominatimErrorMessage.value = "Please enter a location";
    return null;
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`${response.status.toString()}: ${response.statusText}`);
    }

    const data = (await response.json()) as NominatimSearchResult[];

    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } else {
      throw new Error(`Could not find coordinates for "${query}".`);
    }
  } catch (error: any) {
    if (error instanceof Error) {
      nominatimErrorMessage.value = error.message;
      return;
    } else {
      nominatimErrorMessage.value = "An unknown error occurred";
    }
  } finally {
    nominatimIsLoading.value = false;
  }
};

const reverseGeocode = async (
  coordinates: Coordinates,
): Promise<string | undefined> => {
  nominatimIsLoading.value = true;
  nominatimErrorMessage.value = null;

  try {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${coordinates.latitude.toString()}&lon=${coordinates.longitude.toString()}&format=geocodejson&addressdetails=1`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`${response.status.toString()}: ${response.statusText}`);
    }

    const data = await response.json();
    const feature = data.features?.[0];

    if (feature?.properties?.geocoding) {
      const geo = feature.properties.geocoding;
      const district: string = geo.district;
      const city: string = geo.city ?? geo.town ?? geo.village;
      const country: string = geo.country;

      return `${district}, ${city}, ${country}`;
    }
  } catch (error: any) {
    if (error instanceof Error) {
      nominatimErrorMessage.value = error.message;
      return;
    } else {
      nominatimErrorMessage.value = "An unknown error occurred";
    }
  } finally {
    nominatimIsLoading.value = false;
  }
};

export function useNominatim() {
  return {
    nominatimIsLoading,
    nominatimErrorMessage,
    forwardGeocode,
    reverseGeocode,
  };
}
