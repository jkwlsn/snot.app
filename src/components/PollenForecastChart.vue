<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error loading data.</div>
  <template v-else-if="data">
    <PollenForecastFilter
      v-model:min-level="minLevel"
      v-model:selected-pollen-types="selectedPollenTypes"
      :max-pollen-level="maxPollenLevel"
    />
    <div>
      <ChartLine
        id="pollen-forecast-chart"
        chartTitle="Pollen Levels Over Time"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ChartLine from "./ChartLine.vue";
import PollenForecastFilter from "./PollenForecastFilter.vue";
import { usePollenChartData } from "../composables/usePollenChartData";
import { useOpenMeteoAPI } from "../composables/useOpenMeteo";
import { usePollenFilters } from "../composables/usePollenFilters";
import { OPENMETEO_POLLEN_TYPES } from "../config";
import type { PollenType } from "../interfaces/PollenTypes";
import type { PollenRecord } from "../interfaces/Pollen";

const minLevel = ref(0);
const selectedPollenTypes = ref<PollenType[]>([]);

const { data, loading, error } = useOpenMeteoAPI();
const { levelFilter, typeFilter, applyFilters } = usePollenFilters();

const maxPollenLevel = computed<number>(() => {
  if (!data.value) return 0;

  let maxLevel = 0;
  data.value.records.forEach((record: PollenRecord) => {
    OPENMETEO_POLLEN_TYPES.forEach((pollenType) => {
      const level = record.levels[pollenType];
      if (level !== null && level > maxLevel) {
        maxLevel = Math.ceil(level);
      }
    });
  });
  return maxLevel;
});

const filteredPollenData = computed(() => {
  const filters = [];

  if (!data.value) {
    return { records: [], latitude: 0, longitude: 0 };
  }

  if (minLevel.value > 0) {
    filters.push(levelFilter(minLevel.value));
  }

  if (selectedPollenTypes.value.length > 0) {
    filters.push(typeFilter(selectedPollenTypes.value));
  }

  return applyFilters(data.value, filters);
});

const { chartData, chartOptions } = usePollenChartData(filteredPollenData);
</script>
