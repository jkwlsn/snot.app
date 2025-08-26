import { ref, readonly } from 'vue';
import { useUserSettings } from './useUserSettings';

const { settings } = useUserSettings();

const coords = ref(settings.value.location);
const isGeolocationEnabled = ref(false);
const loading = ref(false);
const error = ref(null);

function getErrorMessage(err) {
  if (err.code === 1)
    return 'Location permission denied. Please enable location access in browser settings.';
  if (err.code === 2) return 'Position unavailable.';
  if (err.code === 3) return 'Location request timed out.';
  return err.message || 'Failed to get location.';
}

async function requestLocation() {
  if (loading.value) return;
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

    coords.value = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
    settings.value.location = coords.value;
    isGeolocationEnabled.value = true;
  } catch (err) {
    error.value = getErrorMessage(err);
    isGeolocationEnabled.value = false;
  } finally {
    loading.value = false;
  }
}

export function useGeoLocation() {
  return {
    coords: readonly(coords),
    isGeolocationEnabled: readonly(isGeolocationEnabled),
    loading: readonly(loading),
    error: readonly(error),
    requestLocation,
  };
}
