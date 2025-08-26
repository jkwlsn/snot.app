// composables/useSneezePrediction.js
import { computed } from 'vue';
import { usePollenData } from './usePollenData';
import { useUserSettings } from './useUserSettings';
import { ALERT_LIMIT_BASE } from './../config';

export function useSneezePrediction() {
  const { parsedData } = usePollenData();
  const { settings } = useUserSettings();

  const prediction = computed(() => {
    if (!parsedData.value || !settings.value.selected_pollens) {
      return 'Maybe';
    }

    const sensitivities = settings.value.selected_pollens;
    const pollenData = parsedData.value;
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    let maxRisk = 0;

    for (const pollen in sensitivities) {
      const sensitivity = sensitivities[pollen];
      if (sensitivity === 0) continue;

      const pollenLevels = pollenData[pollen];
      if (!pollenLevels) continue;

      const limit = Math.round(ALERT_LIMIT_BASE / sensitivity);

      for (let i = 0; i < pollenData.time.length; i++) {
        const time = new Date(pollenData.time[i]);
        if (time >= now && time <= twentyFourHoursFromNow) {
          const level = pollenLevels[i];
          if (level > limit) {
            if (sensitivity >= 7) {
              maxRisk = Math.max(maxRisk, 2); 
            } else {
              maxRisk = Math.max(maxRisk, 1);
            }
          }
        }
      }
    }

    if (maxRisk === 2) return 'Yes';
    if (maxRisk === 1) return 'Maybe';
    return 'No';
  });

  return {
    prediction,
  };
}
