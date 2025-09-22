// composables/useSneezePrediction.js
import { computed } from 'vue';
import { usePollenData } from './usePollenData';
import { useUserSettings } from './useUserSettings';
import { useSneezeMLPrediction } from './useSneezeMLPrediction'; // Import ML prediction
import { calculateSneezePrediction } from './../utils/sneezePredictionUtils';
import { ALERT_LIMIT_BASE } from './../config';

export function useSneezePrediction() {
  const { parsedData } = usePollenData();
  const { settings } = useUserSettings();
  const { mlOverallPrediction, loading, error } = useSneezeMLPrediction(); // Get ML prediction

  const prediction = computed(() => {
    if (loading.value || error.value) {
      // Fallback to rule-based if ML prediction is loading or has an error
      return calculateSneezePrediction(
        parsedData.value,
        settings.value.selected_pollens,
        ALERT_LIMIT_BASE,
      );
    } else if (mlOverallPrediction.value) {
      return mlOverallPrediction.value;
    } else {
      // Fallback to rule-based if ML prediction is not yet available (e.g., no training data)
      return calculateSneezePrediction(
        parsedData.value,
        settings.value.selected_pollens,
        ALERT_LIMIT_BASE,
      );
    }
  });

  return {
    prediction,
  };
}
