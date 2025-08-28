// composables/useSneezePrediction.js
import { computed } from 'vue';
import { usePollenData } from './usePollenData';
import { useUserSettings } from './useUserSettings';
import { calculateSneezePrediction } from './../utils/sneezePredictionUtils';
import { ALERT_LIMIT_BASE } from './../config';

export function useSneezePrediction() {
  const { parsedData } = usePollenData();
  const { settings } = useUserSettings();

  const prediction = computed(() => {
    return calculateSneezePrediction(
      parsedData.value,
      settings.value.selected_pollens,
      ALERT_LIMIT_BASE,
    );
  });

  return {
    prediction,
  };
}
