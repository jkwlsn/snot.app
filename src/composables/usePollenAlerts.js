import { computed, watch, ref } from 'vue';
import { useUserSettings } from './useUserSettings';
import { useNotifications } from './useNotifications';

export function usePollenAlerts(parsedData) {
  const { requestPermission, sendPollenAlertNotification } = useNotifications();

  requestPermission();

  const { settings } = useUserSettings();
  const sensitivity = computed(() => settings.value.sensitivity);

  const warnings = ref([]);

  watch(
    [parsedData, sensitivity],
    ([newParsedData, newSensitivity]) => {
      if (!newParsedData || !newSensitivity) {
        warnings.value = [];
        return;
      }

      const limit = Math.round(200 / newSensitivity);
      const pollenData = newParsedData;

      const now = new Date();

      const newWarnings = Object.entries(pollenData)
        .filter(([key]) => key !== 'time')
        .flatMap(([pollenKey, pollenValues]) =>
          pollenValues
            .map((pollenValue, index) => {
              const rawTime = pollenData.time[index];
              const time = rawTime ? new Date(rawTime) : undefined;
              return {
                pollenKey,
                pollenValue,
                time,
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
            }),
        );

      sendPollenAlertNotification(newWarnings, limit);

      warnings.value = newWarnings;
    },
    { immediate: true },
  );

  return warnings;
}
