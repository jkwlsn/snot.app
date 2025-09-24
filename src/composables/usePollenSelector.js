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