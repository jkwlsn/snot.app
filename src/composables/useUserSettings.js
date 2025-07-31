import { ref, watch } from 'vue';

const STORAGE_KEY = 'snotAppSettings';
const defaultSettings = {
  location: null,
  sensitivity: 5,
};

function loadSettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { ...defaultSettings };
  } catch {
    return { ...defaultSettings };
  }
}

const settings = ref(loadSettings());

watch(
  settings,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  },
  { deep: true },
);

export function useUserSettings() {
  return {
    settings,
  };
}
