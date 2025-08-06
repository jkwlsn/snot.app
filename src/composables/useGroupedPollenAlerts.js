import { computed } from 'vue';
import { useUserSettings } from './useUserSettings';

export function useGroupedPollenAlerts(alerts) {
  const { settings } = useUserSettings();

  const getLimit = (key) => {
    const sensitivity = settings.value.selected_pollen?.[key] || 1;
    return Math.round(200 / sensitivity);
  };

  return computed(() => {
    if (!alerts.value?.length) return [];

    const sorted = [...alerts.value].sort(
      (a, b) => a.time.getTime() - b.time.getTime(),
    );

    const result = [];
    let current = null;

    for (const w of sorted) {
      const limit = getLimit(w.pollenKey);

      const isConsecutive =
        current &&
        w.time.getTime() === current.endTime.getTime() + 60 * 60 * 1000;

      if (!current || !isConsecutive) {
        if (current) result.push(current);
        current = {
          startTime: w.time,
          endTime: w.time,
          pollenDetails: {
            [w.pollenKey]: {
              maxPollenValue: w.pollenValue,
              limit,
            },
          },
        };
      } else {
        current.endTime = w.time;
        const existing = current.pollenDetails[w.pollenKey];
        if (!existing) {
          current.pollenDetails[w.pollenKey] = {
            maxPollenValue: w.pollenValue,
            limit,
          };
        } else {
          existing.maxPollenValue = Math.max(
            existing.maxPollenValue,
            w.pollenValue,
          );
        }
      }
    }

    if (current) result.push(current);

    return result.map((range) => {
      const format = (date) =>
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const timeRange = `${format(range.startTime)} - ${format(range.endTime)}`;

      const pollenInfo = Object.entries(range.pollenDetails)
        .map(([key, val]) => `${key} (${Math.round(val.maxPollenValue)})`)
        .join(', ');

      return { timeRange, pollenInfo };
    });
  });
}
