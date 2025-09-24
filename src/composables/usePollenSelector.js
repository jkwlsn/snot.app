import { reactive, watch } from 'vue';
import { settings } from './useUserSettings';

export function usePollenSelector() {
  const rawPollens = import.meta.env.VITE_POLLENS || '';
  const pollens = rawPollens
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  // settings is now directly imported

  const allergens = reactive({});
  pollens.forEach((pollen) => {
    // Initialize with 1 or 0 based on stored value
    allergens[pollen] = (settings.value.selected_pollens && settings.value.selected_pollens[pollen]) ? 1 : 0;
  });

  watch(allergens, (newVals) => {
    // Convert reactive object to plain object with 1s and 0s
    const updatedSelectedPollens = {};
    for (const pollenType in newVals) {
      updatedSelectedPollens[pollenType] = newVals[pollenType];
    }
    settings.value.selected_pollens = updatedSelectedPollens;
  });

  function clearAll() {
    pollens.forEach((pollen) => {
      allergens[pollen] = 0;
    });
  }

  function selectAll() {
    pollens.forEach((pollen) => {
      allergens[pollen] = 1;
    });
  }

  return {
    pollens,
    allergens: allergens,
    selectAll,
    clearAll,
  };
}
