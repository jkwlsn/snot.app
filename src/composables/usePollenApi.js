import { ref, watch } from 'vue';
import { fetchWeatherApi } from 'openmeteo';
import { POLLEN_DISPLAY_NAMES } from '../pollen'; // Import all pollen types

export function usePollenApi(location) { // Removed selectedPollens from arguments
  const rawPollenData = ref(null);
  const isLoading = ref(false);
  const fetchError = ref(null);

  async function fetchPollen() {
    if (
      !location.value?.latitude ||
      !location.value?.longitude
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
          hourly: Object.keys(POLLEN_DISPLAY_NAMES), // Fetch all pollen types
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

  watch([location], fetchPollen, { immediate: true }); // Removed selectedPollens from watch

  return {
    rawPollenData,
    isLoading,
    fetchError,
    fetchPollen,
  };
}