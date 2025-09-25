import { reactive, watch } from 'vue';
import { settings } from './useUserSettings';
import { ALL_POLLEN_TYPES } from '../pollen'; // Import all pollen types
import { POLLEN_SELECTOR_DEBOUNCE_DELAY } from '../config'; // Import debounce delay

// Basic debounce utility
const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

export function usePollenSelector() {
  const pollens = ALL_POLLEN_TYPES; // Use the new constant

  // settings is now directly imported

  const allergens = reactive({});
  pollens.forEach((pollen) => {
    allergens[pollen] = !!(
      settings.value.selected_pollens && settings.value.selected_pollens[pollen]
    );
  });

  const updateSettings = (newVals) => {
    settings.value.selected_pollens = newVals;
  };

  const debouncedUpdateSettings = debounce(updateSettings, POLLEN_SELECTOR_DEBOUNCE_DELAY);

  watch(allergens, (newVals) => {
    debouncedUpdateSettings(newVals);
  });

  function clearAll() {
    pollens.forEach((pollen) => {
      allergens[pollen] = false;
    });
  }

  function selectAll() {
    pollens.forEach((pollen) => {
      allergens[pollen] = true;
    });
  }

  return {
    pollens,
    allergens: allergens,
    selectAll,
    clearAll,
  };
}
