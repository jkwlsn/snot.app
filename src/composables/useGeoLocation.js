import { ref } from 'vue';
import { useUserSettings } from './useUserSettings';

export function useGeoLocation() {
  const loading = ref(false);
  const error = ref(null);
  const { settings } = useUserSettings();

  function getErrorMessage(err) {
    if (err.code === 1)
      return 'Location permission denied. Please enable location access in browser settings.';
    if (err.code === 2) return 'Position unavailable.';
    if (err.code === 3) return 'Location request timed out.';
    return err.message || 'Failed to get location.';
  }

  async function getLocation() {
    loading.value = true;
    error.value = null;

    try {
      const pos = await new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
          reject(new Error('GeoLocation not supported.'));
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      settings.value.location = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
    } catch (err) {
      error.value = getErrorMessage(err);
      settings.value.location = null;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    getLocation,
  };
}
