<template>
  <section>
    <h2>Pollen Forecast Chart</h2>
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
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ChartLine from "./ChartLine.vue";
import PollenForecastFilter from "./PollenForecastFilter.vue";
import { usePollenChartData } from "../composables/usePollenChartData";
import type { PollenType } from "../interfaces/PollenTypes";

const minLevel = ref(0);
const selectedPollenTypes = ref<PollenType[]>([]);

const { chartData, chartOptions, loading, error, maxPollenLevel } =
  usePollenChartData(minLevel, selectedPollenTypes);
</script>
