import { useUserSettings } from './useUserSettings';
import { ALERT_LIMIT_BASE } from './../config';

export function usePollenSeverity() {
  const { settings } = useUserSettings();

  function calculateLimit(sensitivity) {
    return sensitivity > 0
      ? Math.round(ALERT_LIMIT_BASE / sensitivity)
      : Infinity;
  }

  function getPollenSeverity(value, limit) {
    const ratio = value / limit;

    if (ratio < 1.5) return { label: 'Low', emoji: '🟢' };
    if (ratio < 2) return { label: 'Moderate', emoji: '🟡' };
    if (ratio < 3) return { label: 'High', emoji: '🟠' };
    return { label: 'Very High', emoji: '🔴' };
  }

  function getSeverity(pollenKey, pollenValue) {
    const sensitivity = settings.value.selected_pollens[pollenKey] || 0;
    const limit = calculateLimit(sensitivity);
    return getPollenSeverity(pollenValue, limit);
  }

  return {
    getSeverity,
  };
}
