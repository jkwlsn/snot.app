import { ref, computed, watch } from 'vue';
import { POLLEN_DATA_STORAGE_KEY } from '../config';
import { useGeoLocation } from './useGeoLocation';
import { useNotifications } from './useNotifications';
import { usePollenApi } from './usePollenApi';
import { usePollenDataParser } from './usePollenDataParser';
import { useLocalStorageCache } from './useLocalStorageCache';
import { settings } from './useUserSettings';

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Move state and watchers outside the function to create a singleton pattern
const { coords } = useGeoLocation();
const { sendNotification } = useNotifications();

const noPollenDataAvailable = ref(false);

const selectedPollens = computed(() =>
  Object.entries(settings.value.selected_pollens || {})
    .filter(([, v]) => v > 0)
    .map(([k]) => k),
);

const { cachedData, loadFromStorage, saveToStorage, clearCache } = useLocalStorageCache(
  POLLEN_DATA_STORAGE_KEY,
  { parsedData: {}, displayData: {} },
  CACHE_TTL,
);

const { rawPollenData, isLoading, fetchError, fetchPollen } = usePollenApi(
  coords,
);

const { parsedData, displayData } = usePollenDataParser(
  rawPollenData,
  selectedPollens,
);

// Helper to check if all parsed pollen data values are null (excluding 'time')
const checkIfAllPollenDataIsNull = (data) => {
  if (!data || Object.keys(data).length === 0) return true;

  const pollenKeys = Object.keys(data).filter(key => key.endsWith('_pollen'));

  if (pollenKeys.length === 0) return true;

  const allNull = pollenKeys.every(key => {
    const pollenArray = data[key];
    const isArrayAndAllNull = Array.isArray(pollenArray) && pollenArray.every(value => isNaN(value));
    return isArrayAndAllNull;
  });
  return allNull;
};

// Watch for changes in rawPollenData and save to cache
watch(
  rawPollenData,
  (newVal) => {
    if (newVal) {
      saveToStorage({
        parsedData: parsedData.value,
        displayData: displayData.value,
      });
    }
    noPollenDataAvailable.value = checkIfAllPollenDataIsNull(parsedData.value);

    // Only send notification if pollen types are selected and no data is available
    if (selectedPollens.value.length > 0 && noPollenDataAvailable.value) {
      sendNotification('Pollen Data Unavailable', {
        body: 'We apologize, but pollen data is not available for your current location.',
        icon: '/favicon.ico',
      });
    }
  },
  { deep: true },
);

// Load cache on initial setup
loadFromStorage();

// Watch for changes in coords or selectedPollens and fetch new data
watch(
  [coords],
  ([newCoords, oldCoords]) => {
    const areCoordsEqual = (c1, c2) => {
      if (!c1 && !c2) return true;
      if (!c1 || !c2) return false;
      return c1.latitude === c2.latitude && c1.longitude === c2.longitude;
    };

    if (!areCoordsEqual(newCoords, oldCoords)) {
      clearCache();
      fetchPollen();
    } else if (
      !cachedData.value.parsedData ||
      Object.keys(cachedData.value.parsedData).length === 0 ||
      (cachedData.value.timestamp &&
        Date.now() - cachedData.value.timestamp > CACHE_TTL)
    ) {
      fetchPollen();
    }
  },
  { deep: true },
);

export function usePollenData() {
  return {
    parsedData: computed(() => parsedData.value || cachedData.value.parsedData),
    displayData: computed(
      () => displayData.value || cachedData.value.displayData,
    ),
    isLoading,
    fetchError,
    fetchPollen,
    noPollenDataAvailable: computed(() => noPollenDataAvailable.value),
  };
}