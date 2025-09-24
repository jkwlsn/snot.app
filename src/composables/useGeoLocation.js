import { ref, readonly, computed, watch } from 'vue';
import { settings } from './useUserSettings'; // Import settings directly

const autoCoords = ref(settings.value.location || null);
const autoAddress = ref(settings.value.auto_address || ''); // New ref for auto address
const manualCoords = ref(settings.value.manual_location || null);
const manualAddress = ref(settings.value.manual_address || '');
const isGeolocationEnabled = ref(!!settings.value.location);
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

// Computed property to return the active address
const activeAddress = computed(() => {
  if (isManualLocationActive.value) {
    return manualAddress.value;
  }
  return autoAddress.value;
});

// Computed property to return true if any location (auto or manual) is active
const hasActiveLocation = computed(() => {
  return (!!autoCoords.value && !isManualLocationActive.value) || (!!manualCoords.value && isManualLocationActive.value);
});

function getErrorMessage(err) {
  if (err.code === 1)
    return 'Location permission denied. Please enable location access in browser settings or set a manual location.';
  if (err.code === 2) return 'Position unavailable. Please try again.';
  if (err.code === 3) return 'Location request timed out. Please try again.';
  return err.message || 'Failed to get location. Please try again.';
}

async function reverseGeocode(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10&addressdetails=1`,
    );
    const data = await response.json();
    if (data && data.address) {
      const address = data.address;
      const displayAddress = (
        address.city ||
        address.town ||
        address.village ||
        address.borough ||
        data.display_name
      );
      return { displayAddress };
    }
    return { displayAddress: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}` }; // Fallback to coordinates
  } catch (e) {
    console.error('Reverse geocoding error:', e);
    return { displayAddress: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}` }; // Fallback on error
  }
}

async function requestLocation() {
  if (loading.value) return;
  loading.value = true;
  error.value = null;
  isManualLocationActive.value = false; // Deactivate manual location when requesting auto

  try {
    const pos = await new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('GeoLocation not supported by your browser.'));
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

    // Perform reverse geocoding for auto-detected location
    const { displayAddress: autoDetectedAddress } = await reverseGeocode(autoCoords.value.latitude, autoCoords.value.longitude);
    autoAddress.value = autoDetectedAddress;
    settings.value.auto_address = autoAddress.value; // Persist auto address

    isGeolocationEnabled.value = true;
  } catch (err) {
    error.value = getErrorMessage(err);
    isAutoLocationActive.value = false; // Renamed
  } finally {
    loading.value = false;
  }
}

async function geocodeAddress(address) {
  // NOTE: For production applications, consider using a dedicated geocoding service with an API key
  // (e.g., Google Geocoding API, Mapbox Geocoding API) for better reliability and rate limits.
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
        address: data[0].display_name, // Store the full address string
      };
    }
    throw new Error('Location not found. Please try a different address.');
  } catch (e) {
    console.error('Geocoding error:', e);
    throw e;
  }
}

async function setManualLocationCoords(address) {
  loading.value = true;
  error.value = null;
  try {
    const newLocation = await geocodeAddress(address);
    manualCoords.value = { latitude: newLocation.latitude, longitude: newLocation.longitude };
    manualAddress.value = newLocation.address;
    isManualLocationActive.value = true;
    isGeolocationEnabled.value = false; // Deactivate auto-geolocation
    settings.value.manual_location = manualCoords.value;
    settings.value.manual_address = manualAddress.value;
    settings.value.use_manual_location = true;
  } catch (e) {
    error.value = e.message;
  }
  finally {
    loading.value = false;
  }
}

// Watch for changes in manual location activation and persist
watch(isManualLocationActive, (newVal) => {
  settings.value.use_manual_location = newVal;
});

function toggleManualLocation() {
  isManualLocationActive.value = !isManualLocationActive.value;
  // If switching to auto-detect, always request location to ensure fresh data
  if (!isManualLocationActive.value) {
    requestLocation();
  }
}

export function useGeoLocation() {
  return {
    coords: readonly(coords),
    activeAddress: readonly(activeAddress), // Export activeAddress
    manualAddress: readonly(manualAddress),
    autoAddress: readonly(autoAddress), // Export autoAddress
    isGeolocationEnabled: readonly(isGeolocationEnabled),
    isManualLocationActive: readonly(isManualLocationActive),
    loading: readonly(loading),
    error: readonly(error),
    requestLocation,
    setManualLocationCoords,
    toggleManualLocation,
    hasActiveLocation: readonly(hasActiveLocation), // Export hasActiveLocation
  };
}