import { computed, watch, ref } from 'vue';
import { settings } from './useUserSettings';
import { useNotifications } from './useNotifications';
import { calculateLimit } from './../utils/pollenUtils';

export function usePollenAlerts(parsedData) {
  const { requestPermission, sendPollenAlertNotification } = useNotifications();
  // settings is now directly imported

  requestPermission();

  const sensitivities = computed(() => settings.value.selected_pollens || {});

  const warnings = ref([]);

  function createWarnings(data, sensitivityMap) {
    if (!data || !sensitivityMap) return [];

    const times = data.time || [];
    const nowTime = Date.now();

    return Object.entries(data)
      .filter(([key]) => key !== 'time')
      .flatMap(([pollenKey, values]) => {
        const sensitivity = sensitivityMap[pollenKey];
        if (!sensitivity || sensitivity <= 0) return [];

        const limit = calculateLimit(sensitivity);

        return values
          .map((value, i) => {
            const time = new Date(times[i]);
            if (isNaN(time)) return null;

            // Only future times with pollen above limit trigger warnings
            if (time.getTime() >= nowTime && value > limit) {
              return {
                pollenKey,
                pollenValue: value,
                time,
                limit,
              };
            }
            return null;
          })
          .filter(Boolean);
      });
  }

  watch(
    [parsedData, sensitivities],
    ([data, sensitivityMap]) => {
      const newWarnings = createWarnings(data, sensitivityMap);

      // Build limitMap: pollenKey -> calculated limit
      const limitMap = {};
      for (const [pollenKey, sensitivity] of Object.entries(sensitivityMap)) {
        limitMap[pollenKey] = calculateLimit(sensitivity);
      }

      // Only update and notify if warnings have changed
      const changed =
        newWarnings.length !== warnings.value.length ||
        newWarnings.some((w, i) => {
          const old = warnings.value[i];
          return (
            !old ||
            old.pollenKey !== w.pollenKey ||
            old.pollenValue !== w.pollenValue ||
            old.time.getTime() !== w.time.getTime()
          );
        });

      if (changed) {
        warnings.value = newWarnings;
        sendPollenAlertNotification(newWarnings, limitMap);
      }
    },
    { immediate: true },
  );

  return warnings;
}