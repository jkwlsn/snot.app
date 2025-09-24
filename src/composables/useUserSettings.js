import { ref, watch } from 'vue';

const STORAGE_KEY = 'snotAppSettings';

const DEFAULT_SETTINGS = Object.freeze({
  location: null,
  selected_pollens: {},
  custom_symptoms: [], // New property for custom symptom types
  isFirstTimeUser: true, // New property
});

// Load from localStorage with safety checks
function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw);

    return {
      ...DEFAULT_SETTINGS,
      ...(typeof parsed === 'object' && parsed !== null ? parsed : {}),
    };
  } catch (err) {
    console.warn('[useUserSettings] Failed to load settings:', err);
    return { ...DEFAULT_SETTINGS };
  }
}

// Save to localStorage
function persistSettings(val) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  } catch (err) {
    console.error('[useUserSettings] Failed to persist settings:', err);
  }
}

const settings = ref(loadSettings());

// Watch and persist deeply
watch(
  settings,
  (val) => {
    persistSettings(val);
  },
  { deep: true },
);

export const resetSettings = () => (settings.value = { ...DEFAULT_SETTINGS });
export const completeOnboarding = () => {
  settings.value.isFirstTimeUser = false;
};

// Main composable export
export { settings };