import { ref, watch, computed } from 'vue';
import { fetchWeatherApi } from 'openmeteo';
import { useUserSettings } from './useUserSettings';

export function usePollenData() {
  const parsedData = ref(null);
  const isLoading = ref(false);
  const fetchError = ref(null);
  const { settings } = useUserSettings();
  const location = computed(() => settings.value.location);

  async function fetchPollen() {
    if (!location.value?.latitude || !location.value?.longitude) {
      parsedData.value = null;
      return;
    }

    isLoading.value = true;
    fetchError.value = null;

    const url = 'https://air-quality-api.open-meteo.com/v1/air-quality';
    const today = new Date().toISOString().slice(0, 10);

    const params = {
      latitude: location.value.latitude,
      longitude: location.value.longitude,
      hourly: [
        'alder_pollen',
        'birch_pollen',
        'grass_pollen',
        'mugwort_pollen',
        'olive_pollen',
        'ragweed_pollen',
      ],
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

      parsedData.value = {
        time,
        alderPollen: Array.from(hourly.variables(0).valuesArray()),
        birchPollen: Array.from(hourly.variables(1).valuesArray()),
        grassPollen: Array.from(hourly.variables(2).valuesArray()),
        mugwortPollen: Array.from(hourly.variables(3).valuesArray()),
        olivePollen: Array.from(hourly.variables(4).valuesArray()),
        ragweedPollen: Array.from(hourly.variables(5).valuesArray()),
      };
    } catch (err) {
      fetchError.value = 'Failed to fetch pollen data';
      parsedData.value = null;
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  watch(location, fetchPollen, { immediate: true });

  return {
    parsedData,
    isLoading,
    fetchError,
    fetchPollen,
  };
}
