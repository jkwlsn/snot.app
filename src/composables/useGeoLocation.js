import { ref, readonly, computed, watch } from 'vue';
import { useUserSettings } from './useUserSettings';

const { settings } = useUserSettings();

const autoCoords = ref(settings.value.location || null);
const manualCoords = ref(settings.value.manual_location || null);
const isGeolocationEnabled = ref(false); // Tracks if auto-geolocation is active and successful
const isManualLocationActive = ref(settings.value.use_manual_location || false);
const loading = ref(false);
const error = ref(null);

// Computed property to return the active coordinates
const coords = computed(() => {
  if (isManualLocationActive.value && manualCoords.value) {
    return manualCoords.value;
  }
  return autoCoords.value;
});

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
  isManualLocationActive.value = false; // Deactivate manual location when requesting auto

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

    autoCoords.value = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
    settings.value.location = autoCoords.value;
    isGeolocationEnabled.value = true;
  } catch (err) {
    error.value = getErrorMessage(err);
    isGeolocationEnabled.value = false;
  } finally {
    loading.value = false;
  }
}

async function geocodeAddress(address) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address,
      )}&format=json&limit=1`,
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }
    throw new Error('Location not found.');
  } catch (e) {
    console.error('Geocoding error:', e);
    throw e;
  }
}

async function setManualLocationCoords(address) {
  loading.value = true;
  error.value = null;
  try {
    const newCoords = await geocodeAddress(address);
    manualCoords.value = newCoords;
    isManualLocationActive.value = true;
    isGeolocationEnabled.value = false; // Deactivate auto-geolocation
    settings.value.manual_location = newCoords;
    settings.value.use_manual_location = true;
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

// Watch for changes in manual location activation and persist
watch(isManualLocationActive, (newVal) => {
  settings.value.use_manual_location = newVal;
});

export function useGeoLocation() {
  return {
    coords: readonly(coords),
    isGeolocationEnabled: readonly(isGeolocationEnabled),
    isManualLocationActive: readonly(isManualLocationActive),
    loading: readonly(loading),
    error: readonly(error),
    requestLocation,
    setManualLocationCoords,
  };
}
