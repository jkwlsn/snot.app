import { computed } from 'vue';
import { useUserSettings } from './useUserSettings';
import { ALERT_LIMIT_BASE } from './../config';
import { POLLEN_DISPLAY_NAMES } from './../pollen';

const ONE_HOUR = 60 * 60 * 1000;

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function useGroupedPollenAlerts(alerts) {
  const { settings } = useUserSettings();

  const getLimit = (key) => {
    const sensitivity = settings.value.selected_pollen?.[key] ?? 1;
    return Math.round(ALERT_LIMIT_BASE / sensitivity);
  };

  return computed(() => {
    const alertList = alerts.value;
    if (!alertList?.length) return [];

    const sorted = [...alertList].sort(
      (a, b) => a.time.getTime() - b.time.getTime(),
    );

    const grouped = [];
    let currentGroup = null;

    for (const warning of sorted) {
      const limit = getLimit(warning.pollenKey);

      const isConsecutive =
        currentGroup &&
        warning.time.getTime() === currentGroup.endTime.getTime() + ONE_HOUR;

      if (!currentGroup || !isConsecutive) {
        if (currentGroup) grouped.push(currentGroup);

        currentGroup = {
          startTime: warning.time,
          endTime: warning.time,
          pollenDetails: {
            [warning.pollenKey]: { maxPollenValue: warning.pollenValue, limit },
          },
        };
      } else {
        currentGroup.endTime = warning.time;
        const existing = currentGroup.pollenDetails[warning.pollenKey];

        if (!existing) {
          currentGroup.pollenDetails[warning.pollenKey] = {
            maxPollenValue: warning.pollenValue,
            limit,
          };
        } else {
          existing.maxPollenValue = Math.max(
            existing.maxPollenValue,
            warning.pollenValue,
          );
        }
      }
    }

    if (currentGroup) grouped.push(currentGroup);

    return grouped.map(({ startTime, endTime, pollenDetails }) => {
      const timeRange = `${formatTime(startTime)} - ${formatTime(endTime)}`;

      const pollenInfo = Object.entries(pollenDetails)
        .map(([key, val]) => {
          const displayName = POLLEN_DISPLAY_NAMES[key] ?? key;
          return `${displayName} (${Math.round(val.maxPollenValue)})`;
        })
        .join(', ');

      return { timeRange, pollenInfo };
    });
  });
}
