import { computed, watch, ref } from 'vue';
import { useUserSettings } from './useUserSettings';
import { useNotifications } from './useNotifications';

export function usePollenAlerts(parsedData) {
  const { requestPermission, sendPollenAlertNotification } = useNotifications();
  requestPermission();

  const { settings } = useUserSettings();

  // Use the whole pollen sensitivity map
  const pollenSensitivities = computed(
    () => settings.value.selected_pollen || {},
  );

  const warnings = ref([]);

  watch(
    [parsedData, pollenSensitivities],
    ([newParsedData, newSensitivities]) => {
      if (!newParsedData || !newSensitivities) {
        warnings.value = [];
        return;
      }

      const now = new Date();

      const newWarnings = Object.entries(newParsedData)
        .filter(([key]) => key !== 'time')
        .flatMap(([pollenKey, pollenValues]) => {
          const sensitivity = newSensitivities[pollenKey] || 0;
          if (sensitivity <= 0) return []; // skip if sensitivity 0 or undefined

          const limit = Math.round(200 / sensitivity);

          return pollenValues
            .map((pollenValue, index) => {
              const rawTime = newParsedData.time[index];
              const time = rawTime ? new Date(rawTime) : undefined;
              return {
                pollenKey,
                pollenValue,
                time,
                limit,
              };
            })
            .filter(({ pollenValue, time }) => {
              if (
                time === undefined ||
                !(time instanceof Date) ||
                isNaN(time.getTime())
              ) {
                return false;
              }
              if (pollenValue <= limit) return false;
              return time.getTime() >= now.getTime();
            });
        });

      sendPollenAlertNotification(newWarnings, null); // you can customize notification params as needed
      warnings.value = newWarnings;
    },
    { immediate: true },
  );

  return warnings;
}
