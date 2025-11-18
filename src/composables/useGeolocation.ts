import { type Ref, computed, ref, watch } from "vue";
import type { Coordinates } from "../interfaces/Coordinates";
import { useBrowserGeolocation } from "./useBrowserGeolocation";
import { useNominatim } from "./useNominatim";

interface UseGeolocationReturn {
  confirmedLocationName: Ref<string>;
  locationCoordinates: Ref<Coordinates | null>;
  manualSearchQuery: Ref<string>;
  anyLoading: Ref<boolean>;
  isLoadingGps: Ref<boolean>;
  isLoadingManual: Ref<boolean>;
  anyError: Ref<string | null>;
  errorGps: Ref<string | null>;
  errorManual: Ref<string | null>;
  requestGpsLocation: () => void;
  searchManualLocation: (query: string) => Promise<void>;
}

export function useGeolocation(): UseGeolocationReturn {
  const nominatim = useNominatim();
  const browserGeolocation = useBrowserGeolocation();

  const confirmedLocationName = ref<string>("");
  const locationCoordinates = ref<Coordinates | null>(null);
  const manualSearchQuery = ref<string>("");

  const isLoadingGps = computed(() => browserGeolocation.loading.value);
  const isLoadingManual = computed(
    () => nominatim.nominatimState.value.isLoading,
  );
  const anyLoading = computed(
    () => isLoadingGps.value || isLoadingManual.value,
  );

  const errorGps = computed(() => browserGeolocation.errorMessage.value);
  const errorManual = computed(
    () => nominatim.nominatimState.value.errorMessage,
  );
  const anyError = computed(
    () => (errorGps.value || errorManual.value) ?? null,
  );

  const updateConfirmedLocation = async (
    coords: Coordinates,
  ): Promise<void> => {
    locationCoordinates.value = coords;
    const resultText = await nominatim.reverseGeocode(coords);
    confirmedLocationName.value = resultText ?? "";
  };

  const requestGpsLocation = (): void => {
    confirmedLocationName.value = "";
    locationCoordinates.value = null;
    browserGeolocation.requestGeolocation();
  };

  const searchManualLocation = async (query: string): Promise<void> => {
    manualSearchQuery.value = query;
    confirmedLocationName.value = "";
    locationCoordinates.value = null;
    const newLocation = await nominatim.forwardGeocode(query);
    if (newLocation) {
      await updateConfirmedLocation(newLocation);
    }
  };

  watch(browserGeolocation.coordinates, (newCoords) => {
    if (newCoords) {
      void updateConfirmedLocation(newCoords);
    }
  });

  return {
    anyError,
    anyLoading,
    confirmedLocationName,
    errorGps,
    errorManual,
    isLoadingGps,
    isLoadingManual,
    locationCoordinates,
    manualSearchQuery,
    requestGpsLocation,
    searchManualLocation,
  };
}
