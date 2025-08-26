import { reactive, watch } from 'vue';
import { useUserSettings } from './useUserSettings.js';

export function usePollenSelector() {
  const rawPollens = import.meta.env.VITE_POLLENS || '';
  const pollens = rawPollens
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  const { settings } = useUserSettings();

  const sensitivities = reactive({});

  pollens.forEach((pollen) => {
    sensitivities[pollen] =
      (settings.value.selected_pollens &&
        settings.value.selected_pollens[pollen]) ||
      0;
  });

  let debounceTimer;

  watch(
    sensitivities,
    (newVals) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        settings.value.selected_pollens = newVals;
      }, 300);
    },
    { deep: true },
  );

  function clearAll() {
    pollens.forEach((pollen) => {
      sensitivities[pollen] = 0;
    });
    settings.value.selected_pollens = {};
  }

  return {
    pollens,
    sensitivities,
    clearAll,
  };
}
