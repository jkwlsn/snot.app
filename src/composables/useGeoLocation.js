import { ref, onMounted } from 'vue';

export function useGeoLocation() {
  const location = ref(null);
  const loading = ref(false);
  const error = ref(null);

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
        if (!navigator.geolocation) {
          reject(new Error('GeoLocation not supported.'));
        } else {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        }
      });

      location.value = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
    } catch (err) {
      error.value = getErrorMessage(err);
    } finally {
      loading.value = false;
    }
  }

  onMounted(getLocation);

  return { location, loading, error, getLocation };
}
