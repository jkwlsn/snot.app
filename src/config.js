// src/config.js
export const ALERT_LIMIT_BASE = 100;
export const SYMPTOMS_STORAGE_KEY = 'snot_app_symptoms';
export const POLLEN_DATA_STORAGE_KEY = 'pollenDataCache';

export const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
export const GEOLOCATION_TIMEOUT = 10000; // 10 seconds
export const POLLEN_SELECTOR_DEBOUNCE_DELAY = 300; // 300ms
export const ML_RETRAIN_DEBOUNCE_DELAY = 1000; // 1 second

export const PREDICTION_CATEGORIES = {
  yes: { label: 'Yes', emoji: '😭' },
  maybe: { label: 'Maybe', emoji: '🙃' },
  no: { label: 'No', emoji: '😀' },
};
