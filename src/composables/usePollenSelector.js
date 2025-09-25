import { reactive, watch } from 'vue';
import { settings } from './useUserSettings';
import { POLLEN_DISPLAY_NAMES } from '../pollen'; // Import pollen names

export function usePollenSelector() {
  const pollens = Object.keys(POLLEN_DISPLAY_NAMES); // Use keys from POLLEN_DISPLAY_NAMES

  // settings is now directly imported

  const allergens = reactive({});
  pollens.forEach((pollen) => {
    allergens[pollen] = !!(
      settings.value.selected_pollens && settings.value.selected_pollens[pollen]
    );
  });

  watch(allergens, (newVals) => {
    settings.value.selected_pollens = newVals;
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
