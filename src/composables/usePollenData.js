import { ref, watch, computed } from 'vue';
import { fetchWeatherApi } from 'openmeteo';
import { useUserSettings } from './useUserSettings';

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

  async function fetchPollen() {
    if (
      !location.value?.latitude ||
      !location.value?.longitude ||
      selectedPollens.value.length === 0
    ) {
      parsedData.value = {};
      displayData.value = {};
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
    } catch (err) {
      fetchError.value = 'Failed to fetch pollen data';
      parsedData.value = {};
      displayData.value = {};
    } finally {
      isLoading.value = false;
    }
  }

  watch(
    [location, selectedPollens],
    () => {
      clearTimeout(fetchTimeout);
      fetchTimeout = setTimeout(fetchPollen, 100);
    },
    { immediate: true },
  );

  return {
    parsedData,
    displayData,
    isLoading,
    fetchError,
    fetchPollen,
  };
}
