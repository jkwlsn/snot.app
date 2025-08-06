import { ref, watch, computed } from 'vue';
import { fetchWeatherApi } from 'openmeteo';
import { useUserSettings } from './useUserSettings';

const STORAGE_KEY = 'pollenDataCache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function saveToStorage(data) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ timestamp: Date.now(), data }),
  );
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function parseHourlyData(hourly, selectedPollens, displayNameMap) {
  const offset = hourly.utcOffsetSeconds?.() ?? 0;
  const t0 = Number(hourly.time?.());
  const tEnd = Number(hourly.timeEnd?.());
  const interval = hourly.interval?.();

  const time = [];
  for (let t = t0; t < tEnd; t += interval) {
    time.push(new Date((t + offset) * 1000));
  }

  const raw = { time };
  const display = { time };

  const count = hourly.variablesLength?.() ?? 0;

  for (let i = 0; i < count; i++) {
    const field = selectedPollens[i];
    if (!field) continue;

    const vals = Array.from(hourly.variables(i).valuesArray());
    raw[field] = vals;

    const displayName = displayNameMap[field];
    if (displayName) display[displayName] = vals;
  }

  return { raw, display };
}

function debounce(fn, delay = 100) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export function usePollenData() {
  const parsedData = ref({});
  const displayData = ref({});
  const isLoading = ref(false);
  const fetchError = ref(null);

  const { settings } = useUserSettings();

  const location = computed(() => settings.value.location);

  const selectedPollens = computed(() =>
    Object.entries(settings.value.selected_pollens || {})
      .filter(([, v]) => v > 0)
      .map(([k]) => k),
  );

  const displayNameMap = {
    alder_pollen: 'Alder',
    birch_pollen: 'Birch',
    grass_pollen: 'Grass',
    mugwort_pollen: 'Mugwort',
    olive_pollen: 'Olive',
    ragweed_pollen: 'Ragweed',
  };

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

      const { raw, display } = parseHourlyData(
        hourly,
        selectedPollens.value,
        displayNameMap,
      );

      parsedData.value = raw;
      displayData.value = display;

      saveToStorage({ parsedData: raw, displayData: display });
    } catch (error) {
      fetchError.value = 'Failed to fetch pollen data';
      parsedData.value = {};
      displayData.value = {};
    } finally {
      isLoading.value = false;
    }
  }

  // Load cache and refresh if stale
  const cached = loadFromStorage();
  if (cached && cached.timestamp && cached.data) {
    parsedData.value = cached.data.parsedData ?? {};
    displayData.value = cached.data.displayData ?? {};

    if (Date.now() - cached.timestamp > CACHE_TTL) {
      fetchPollen();
    }
  } else {
    fetchPollen();
  }

  const debouncedFetch = debounce(fetchPollen, 100);

  watch([location, selectedPollens], debouncedFetch, { immediate: false });

  return {
    parsedData,
    displayData,
    isLoading,
    fetchError,
    fetchPollen,
  };
}
