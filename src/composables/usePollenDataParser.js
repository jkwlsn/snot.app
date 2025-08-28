import { ref, watch } from 'vue';

function parseHourlyData(hourly, selectedPollens, displayNameMap) {
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

  const count = hourly.variablesLength?.() ?? 0;

  for (let i = 0; i < count; i++) {
    const field = selectedPollens[i];
    if (!field) continue;

    const vals = Array.from(hourly.variables(i).valuesArray());
    raw[field] = vals;

    const displayName = displayNameMap[field];
    if (displayName) display[displayName] = vals;
  }

  return { raw, display };
}

export function usePollenDataParser(rawPollenData, selectedPollens) {
  const parsedData = ref({});
  const displayData = ref({});

  const displayNameMap = {
    alder_pollen: 'Alder',
    birch_pollen: 'Birch',
    grass_pollen: 'Grass',
    mugwort_pollen: 'Mugwort',
    olive_pollen: 'Olive',
    ragweed_pollen: 'Ragweed',
  };

  watch(
    [rawPollenData, selectedPollens],
    () => {
      if (rawPollenData.value) {
        const { raw, display } = parseHourlyData(
          rawPollenData.value,
          selectedPollens.value,
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
