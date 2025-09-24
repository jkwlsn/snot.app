import { ref, onMounted } from 'vue';
import { useGeoLocation } from './useGeoLocation';
import { SYMPTOMS_STORAGE_KEY } from '../config';

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

// Move useGeoLocation call to module level for optimization
const { coords, isGeolocationEnabled } = useGeoLocation();

// Renamed from logSneeze to logSymptom, added symptomType parameter
function logSymptom(symptomType, severity, currentPollenData) { // <--- currentPollenData added here
  if (!isGeolocationEnabled.value) {
    return;
  }

  const newSymptom = {
    id: Date.now(),
    time: new Date().toISOString(),
    type: symptomType,
    severity,
    location: {
      latitude: coords.value.latitude,
      longitude: coords.value.longitude,
    },
    pollenDataAtTimeOfLog: currentPollenData, // New property
  };

  symptoms.value.unshift(newSymptom);
  localStorage.setItem(SYMPTOMS_STORAGE_KEY, JSON.stringify(symptoms.value));
}

function clearSymptoms() {
  symptoms.value = [];
  localStorage.removeItem(SYMPTOMS_STORAGE_KEY);
}

function deleteSymptom(id) {
  symptoms.value = symptoms.value.filter((symptom) => symptom.id !== id);
  localStorage.setItem(SYMPTOMS_STORAGE_KEY, JSON.stringify(symptoms.value));
}

export function useSymptomTracker() {
  onMounted(initialize);

  return {
    symptoms,
    logSymptom,
    clearSymptoms,
    deleteSymptom,
    isGeolocationEnabled,
    coords, // Export coords as well
  };
}