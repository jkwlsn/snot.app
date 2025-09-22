import { watch, computed } from 'vue';
import { useUserSettings } from './useUserSettings';
import { usePollenApi } from './usePollenApi';
import { useLocalStorageCache } from './useLocalStorageCache';
import { usePollenDataParser } from './usePollenDataParser';
import { POLLEN_DATA_STORAGE_KEY } from '../config';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function usePollenData() {
  const { settings } = useUserSettings();

  const location = computed(() => settings.value.location);

  const selectedPollens = computed(() =>
    Object.entries(settings.value.selected_pollens || {})
      .filter(([, v]) => v > 0)
      .map(([k]) => k),
  );

  const { cachedData, loadFromStorage, saveToStorage } = useLocalStorageCache(
    POLLEN_DATA_STORAGE_KEY,
    { parsedData: {}, displayData: {} },
    CACHE_TTL,
  );

  const { rawPollenData, isLoading, fetchError, fetchPollen } = usePollenApi(
    location,
    selectedPollens,
  );

  const { parsedData, displayData } = usePollenDataParser(
    rawPollenData,
    selectedPollens,
  );

  // Load cache on initial setup
  loadFromStorage();

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
    },
    { deep: true },
  );

  // If cache is stale or no data, fetch new data
  watch(
    [location, selectedPollens],
    () => {
      if (
        !cachedData.value.parsedData ||
        Object.keys(cachedData.value.parsedData).length === 0 ||
        (cachedData.value.timestamp &&
          Date.now() - cachedData.value.timestamp > CACHE_TTL)
      ) {
        fetchPollen();
      }
    },
    { immediate: true },
  );

  return {
    parsedData: computed(() => parsedData.value || cachedData.value.parsedData),
    displayData: computed(
      () => displayData.value || cachedData.value.displayData,
    ),
    isLoading,
    fetchError,
    fetchPollen,
  };
}
