import { ref, watch, computed } from 'vue';
import { fetchWeatherApi } from 'openmeteo';
import { useUserSettings } from './useUserSettings';

const STORAGE_KEY = 'pollenDataCache';
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours in ms

export function usePollenData() {
  const parsedData = ref({});
  const displayData = ref({});
  const isLoading = ref(false);
  const fetchError = ref(null);

  const { settings } = useUserSettings();
  const location = computed(() => settings.value.location);

  const selectedPollens = computed(() =>
    Object.entries(settings.value.selected_pollens || {})
      .filter(([, value]) => value > 0)
      .map(([key]) => key),
  );

  const displayNameMap = {
    alder_pollen: 'Alder',
    birch_pollen: 'Birch',
    grass_pollen: 'Grass',
    mugwort_pollen: 'Mugwort',
    olive_pollen: 'Olive',
    ragweed_pollen: 'Ragweed',
  };

  let fetchTimeout;

  function saveToStorage(data) {
    const payload = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed;
    } catch {
      return null;
    }
  }

  async function fetchPollen() {
    if (
      !location.value?.latitude ||
      !location.value?.longitude ||
      selectedPollens.value.length === 0
    ) {
      parsedData.value = {};
      displayData.value = {};
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    isLoading.value = true;
    fetchError.value = null;

    try {
      const [response] = await fetchWeatherApi(
        'https://air-quality-api.open-meteo.com/v1/air-quality',
        {
          latitude: location.value.latitude,
          longitude: location.value.longitude,
          hourly: selectedPollens.value,
          start_date: new Date().toISOString().slice(0, 10),
          end_date: new Date().toISOString().slice(0, 10),
        },
      );

      const hourly = response.hourly();
      const offset = response.utcOffsetSeconds();
      const t0 = Number(hourly.time());
      const tEnd = Number(hourly.timeEnd());
      const interval = hourly.interval();

      const time = [];
      for (let t = t0; t < tEnd; t += interval) {
        time.push(new Date((t + offset) * 1000));
      }

      const raw = { time };
      const display = { time };
      const count = hourly.variablesLength();

      for (let i = 0; i < count; i++) {
        const field = selectedPollens.value[i];
        if (!field) continue;

        const vals = Array.from(hourly.variables(i).valuesArray());
        raw[field] = vals;

        const displayName = displayNameMap[field];
        if (displayName) {
          display[displayName] = vals;
        }
      }

      parsedData.value = raw;
      displayData.value = display;

      saveToStorage({ parsedData: raw, displayData: display });
    } catch (err) {
      fetchError.value = 'Failed to fetch pollen data';
      parsedData.value = {};
      displayData.value = {};
    } finally {
      isLoading.value = false;
    }
  }

  // Load from storage on init and check TTL
  const cached = loadFromStorage();
  if (cached && cached.timestamp && cached.data) {
    const age = Date.now() - cached.timestamp;

    // Load cached data anyway
    parsedData.value = cached.data.parsedData || {};
    displayData.value = cached.data.displayData || {};

    if (age > CACHE_TTL) {
      // Cache is stale: fetch fresh data asynchronously
      fetchPollen();
    }
  } else {
    // No valid cache, fetch immediately
    fetchPollen();
  }

  // Watch for changes and fetch with debounce
  watch(
    [location, selectedPollens],
    () => {
      clearTimeout(fetchTimeout);
      fetchTimeout = setTimeout(fetchPollen, 100);
    },
    { immediate: false },
  );

  return {
    parsedData,
    displayData,
    isLoading,
    fetchError,
    fetchPollen,
  };
}
