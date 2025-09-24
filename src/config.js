// src/config.js
export const ALERT_LIMIT_BASE = Number(import.meta.env.VITE_POLLEN_ALERT_BASE) || 200;
export const SYMPTOMS_STORAGE_KEY = 'snot_app_symptoms';
export const POLLEN_DATA_STORAGE_KEY = 'pollenDataCache';

export const ML_PREDICTION_THRESHOLD_YES = Number(import.meta.env.VITE_ML_PREDICTION_THRESHOLD_YES) || 0.7;
export const ML_PREDICTION_THRESHOLD_MAYBE = Number(import.meta.env.VITE_ML_PREDICTION_THRESHOLD_MAYBE) || 0.4;
export const ML_ALLERGY_SEVERITY_THRESHOLD = Number(import.meta.env.VITE_ML_ALLERGY_SEVERITY_THRESHOLD) || 3; // Default to 3

export const PREDICTION_CATEGORIES = {
  yes: { label: 'Yes', emoji: '😭' },
  maybe: { label: 'Maybe', emoji: '🙃' },
  no: { label: 'No', emoji: '😀' },
};
