// src/constants/pollen.js
export const POLLEN_DISPLAY_NAMES = {
  alder_pollen: 'Alder',
  birch_pollen: 'Birch',
  grass_pollen: 'Grass',
  mugwort_pollen: 'Mugwort',
  olive_pollen: 'Olive',
  ragweed_pollen: 'Ragweed',
};

// severityUtils.js
export const getPollenSeverity = (value, limit) => {
  const ratio = value / limit;

  if (ratio < 1.5) return { label: 'Low', emoji: '🟢' };
  if (ratio < 2) return { label: 'Moderate', emoji: '🟡' };
  if (ratio < 3) return { label: 'High', emoji: '🟠' };
  return { label: 'Very High', emoji: '🔴' };
};
