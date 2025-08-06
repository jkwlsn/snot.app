import { ref, watch, computed } from 'vue';
import { fetchWeatherApi } from 'openmeteo';
import { useUserSettings } from './useUserSettings';

export function usePollenData() {
  const parsedData = ref(null);
  const displayData = ref(null);
  const isLoading = ref(false);
  const fetchError = ref(null);

  const { settings } = useUserSettings();

  const location = computed(() => settings.value.location);
  const selectedPollens = computed(() => settings.value.selectedPollens || []);

  // Map API keys to friendly display names
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
      parsedData.value = null;
      displayData.value = null;
      return;
    }

    isLoading.value = true;
    fetchError.value = null;

    const url = 'https://air-quality-api.open-meteo.com/v1/air-quality';
    const today = new Date().toISOString().slice(0, 10);

    const params = {
      latitude: location.value.latitude,
      longitude: location.value.longitude,
      hourly: selectedPollens.value,
      start_date: today,
      end_date: today,
    };

    try {
      const responses = await fetchWeatherApi(url, params);
      const response = responses[0];
      const hourly = response.hourly();
      const utcOffsetSeconds = response.utcOffsetSeconds();

      const time = [];
      for (
        let t = Number(hourly.time());
        t < Number(hourly.timeEnd());
        t += hourly.interval()
      ) {
        time.push(new Date((t + utcOffsetSeconds) * 1000));
      }

      const raw = { time };
      const display = { time };

      const variableCount = hourly.variablesLength();

      for (let i = 0; i < variableCount; i++) {
        const variable = hourly.variables(i);
        const apiFieldName = selectedPollens.value[i]; // ✅ match by index
        const values = Array.from(variable.valuesArray());

        raw[apiFieldName] = values;

        const displayName = displayNameMap[apiFieldName];
        if (displayName) {
          display[displayName] = values;
        }
      }

      parsedData.value = raw;
      displayData.value = display;
    } catch (err) {
      fetchError.value = 'Failed to fetch pollen data';
      parsedData.value = null;
      displayData.value = null;
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  watch([location, selectedPollens], fetchPollen, { immediate: true });

  return {
    parsedData,
    displayData,
    isLoading,
    fetchError,
    fetchPollen,
  };
}
