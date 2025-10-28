<script setup lang="ts">
import { ref } from "vue";
import ChartLine from "./ChartLine.vue";
import { usePollenChartData } from "../composables/usePollenChartData";
import { OPENMETEO_POLLEN_TYPES } from "../config";
import type { PollenType } from "../interfaces/PollenTypes";

const minLevel = ref(0);
const selectedPollenTypes = ref<PollenType[]>([]);

const { chartData, chartOptions, loading, error, maxPollenLevel } = usePollenChartData(
  minLevel,
  selectedPollenTypes,
);
</script>

<template>
  <section>
    <h2>Pollen Forecast Chart</h2>
    <fieldset>
      <legend>Filters</legend>
      <div>
        <label for="minLevel">Minimum Pollen Level: {{ minLevel }}</label>
        <input type="range" id="minLevel" v-model.number="minLevel" min="0" :max="maxPollenLevel + 1" />
      </div>
      <div>
        <label>Pollen Types:</label>
        <div v-for="pollenType in OPENMETEO_POLLEN_TYPES" :key="pollenType">
          <input
            type="checkbox"
            :id="pollenType"
            :value="pollenType"
            v-model="selectedPollenTypes"
          />
          <label :for="pollenType">{{ pollenType.replace("_pollen", "").replace("_", " ") }}</label>
        </div>
      </div>
    </fieldset>
    <div v-if="loading">
      <p>Loading pollen data for chart...</p>
    </div>
    <div v-else-if="error">
      <p>Error loading pollen data: {{ error.message }}</p>
    </div>
    <div v-else-if="chartData.datasets.length > 0">
      <ChartLine
        id="pollen-forecast-chart"
        chartTitle="Pollen Levels Over Time"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
    <div v-else>
      <p>No pollen data available.</p>
    </div>
  </section>
</template>
