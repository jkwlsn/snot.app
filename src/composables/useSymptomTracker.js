import { ref, onMounted, readonly } from 'vue';
import { useGeoLocation } from './useGeoLocation';

const SYMPTOMS_STORAGE_KEY = 'snot_app_symptoms';

const symptoms = ref([]);

let initialized = false;

function initialize() {
  if (initialized) return;

  const storedSymptoms = localStorage.getItem(SYMPTOMS_STORAGE_KEY);
  if (storedSymptoms) {
    symptoms.value = JSON.parse(storedSymptoms);
  }
  initialized = true;
}

function logSneeze(severity) {
  const { coords, isGeolocationEnabled } = useGeoLocation();
  if (!isGeolocationEnabled.value) {
    console.error('Cannot log sneeze: location not available.');
    return;
  }

  const newSneeze = {
    id: Date.now(),
    time: new Date().toISOString(),
    severity,
    location: {
      latitude: coords.value.latitude,
      longitude: coords.value.longitude,
    },
  };

  symptoms.value.unshift(newSneeze);
  localStorage.setItem(SYMPTOMS_STORAGE_KEY, JSON.stringify(symptoms.value));
}

function clearSymptoms() {
  symptoms.value = [];
  localStorage.removeItem(SYMPTOMS_STORAGE_KEY);
}

export function useSymptomTracker() {
  onMounted(initialize);
  const { isGeolocationEnabled } = useGeoLocation();

  return {
    symptoms: readonly(symptoms),
    logSneeze,
    clearSymptoms,
    isGeolocationEnabled,
  };
}
