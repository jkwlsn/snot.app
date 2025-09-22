// src/config.js
export const ALERT_LIMIT_BASE = Number(import.meta.env.VITE_POLLEN_ALERT_BASE) || 200;
export const SYMPTOMS_STORAGE_KEY = 'snot_app_symptoms';
export const POLLEN_DATA_STORAGE_KEY = 'pollenDataCache';

export const PREDICTION_CATEGORIES = {
  yes: { label: 'Yes', emoji: '😭' },
  maybe: { label: 'Maybe', emoji: '🙃' },
  no: { label: 'No', emoji: '😀' },
};
