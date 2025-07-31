import { computed } from 'vue';
import { useUserSettings } from './useUserSettings';

export function usePollenAlerts(parsedData) {
  const { settings } = useUserSettings();
  const sensitivity = computed(() => settings.value.sensitivity);
  return computed(() => {
    if (!parsedData.value || !sensitivity.value) return [];

    const limit = 200 / sensitivity.value;

    const pollenData = parsedData.value;

    const now = new Date();
    const pollenTimes = pollenData.time.map(t => new Date(t));

    return Object.entries(pollenData)
      .filter(([key]) => key !== 'time')
      .flatMap(([pollenKey, pollenValues]) =>
        pollenValues
          .map((pollenValue, index) => ({
            pollenKey,
            pollenValue,
            time: pollenTimes[index],
          }))
          .filter(({ pollenValue, time }) => {
            if (pollenValue <= limit) return false;

            return time.getTime() >= now.getTime();
          }),
      )
      .map(({ pollenKey, pollenValue, time }) => {
        const timeStr = time.toLocaleTimeString();
        return `⚠️ ${pollenKey} count is ${pollenValue} at ${timeStr}, over limit ${limit}`;
      });
  });
}