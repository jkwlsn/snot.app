import { ref, watch } from 'vue';
import { POLLEN_DISPLAY_NAMES } from '../pollen'; // Import all pollen types

function parseHourlyData(hourly, allPollenTypes, displayNameMap) {
  const offset = hourly.utcOffsetSeconds?.() ?? 0;
  const t0 = Number(hourly.time?.());
  const tEnd = Number(hourly.timeEnd?.());
  const interval = hourly.interval?.();

  const time = [];
  for (let t = t0; t < tEnd; t += interval) {
    time.push(new Date((t + offset) * 1000));
  }

  const raw = { time };
  const display = { time };

  // Iterate over all known pollen types to parse data
  allPollenTypes.forEach(field => {
    const index = hourly.variables().findIndex(v => v.variable() === field); // Find index by variable name
    if (index !== -1) {
      const vals = Array.from(hourly.variables(index).valuesArray());
      raw[field] = vals;

      const displayName = displayNameMap[field];
      if (displayName) display[displayName] = vals;
    }
  });

  return { raw, display };
}

export function usePollenDataParser(rawPollenData) { // Removed selectedPollens from arguments
  const parsedData = ref({});
  const displayData = ref({});

  // Use POLLEN_DISPLAY_NAMES directly for the map
  const displayNameMap = POLLEN_DISPLAY_NAMES;
  const allPollenTypes = Object.keys(POLLEN_DISPLAY_NAMES);

  watch(
    [rawPollenData],
    () => {
      if (rawPollenData.value) {
        const { raw, display } = parseHourlyData(
          rawPollenData.value,
          allPollenTypes,
          displayNameMap,
        );
        parsedData.value = raw;
        displayData.value = display;
      } else {
        parsedData.value = {};
        displayData.value = {};
      }
    },
    { immediate: true },
  );

  return {
    parsedData,
    displayData,
  };
}