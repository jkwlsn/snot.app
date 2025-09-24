import { settings } from './useUserSettings';
import { calculateLimit } from './../utils/pollenUtils';

export function usePollenSeverity() {
  // settings is now directly imported

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