import { ref, watch } from 'vue';
import { fetchWeatherApi } from 'openmeteo';

export function usePollenApi(location, selectedPollens) {
  const rawPollenData = ref(null);
  const isLoading = ref(false);
  const fetchError = ref(null);

  async function fetchPollen() {
    if (
      !location.value?.latitude ||
      !location.value?.longitude ||
      selectedPollens.value.length === 0
    ) {
      rawPollenData.value = null;
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
      rawPollenData.value = response.hourly();
    } catch (err) {
      fetchError.value = 'Failed to fetch pollen data: ' + err.message;
      rawPollenData.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  watch([location, selectedPollens], fetchPollen, { immediate: true });

  return {
    rawPollenData,
    isLoading,
    fetchError,
    fetchPollen,
  };
}
