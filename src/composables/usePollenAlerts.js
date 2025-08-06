// usePollenAlerts.js
import { computed, watch, ref } from 'vue';
import { useUserSettings } from './useUserSettings';
import { useNotifications } from './useNotifications';

export function usePollenAlerts(parsedData) {
  const { requestPermission, sendPollenAlertNotification } = useNotifications();
  const { settings } = useUserSettings();

  requestPermission();

  const sensitivities = computed(() => settings.value.selected_pollen || {});
  const now = () => new Date();

  const warnings = ref([]);

  watch(
    [parsedData, sensitivities],
    ([data, sensitivityMap]) => {
      if (!data || !sensitivityMap) {
        warnings.value = [];
        return;
      }

      const entries = Object.entries(data).filter(([key]) => key !== 'time');
      const times = data.time || [];

      const newWarnings = entries.flatMap(([pollenKey, values]) => {
        const sensitivity = sensitivityMap[pollenKey];
        if (!sensitivity || sensitivity <= 0) return [];

        const limit = Math.round(200 / sensitivity);

        return values
          .map((value, i) => {
            const time = new Date(times[i]);
            if (isNaN(time)) return null;

            return {
              pollenKey,
              pollenValue: value,
              time,
              limit,
            };
          })
          .filter((w) => w && w.time >= now() && w.pollenValue > w.limit);
      });

      warnings.value = newWarnings;
      sendPollenAlertNotification(newWarnings, null);
    },
    { immediate: true },
  );

  return warnings;
}
