<template>
  <h2>Symptom History</h2>
  <div>
    <ChartBarPerDay
      id="symptomsPerDay"
      chartTitle="Symptoms Per Day"
      :data="symptomsPerDayChartData"
      :options="symptomsPerDayChartOptions"
    />
  </div>
  <div>
    <ChartBarPerDay
      id="averageSeverity"
      chartTitle="Average Symptom Severity Per Day"
      :data="averageSeverityChartData"
      :options="averageSeverityChartOptions"
    />
  </div>
</template>

<script setup lang="ts">
import ChartBarPerDay from "./ChartBarPerDay.vue";
import { useSymptoms } from "../composables/useSymptoms";
import { useSymptomsPerDayChart } from "../composables/useSymptomsPerDayChart";
import { useAverageSeverityChart } from "../composables/useAverageSeverityChart";
import { computed } from "vue";
import type { SymptomRecord } from "../interfaces/SymptomRecord";
import { aggregateSymptomsByDay } from "../utils/chartDataAggregator";

// Load symptom data
const { symptoms } = useSymptoms();

// Pre-aggregate symptoms by day once in the parent component
const symptomsGroupedByDay = computed<Map<string, SymptomRecord[]>>(() => {
  return aggregateSymptomsByDay(
    symptoms.value,
    () => [] as SymptomRecord[], // Pass a factory function
    (currentSymptoms, symptom) => {
      currentSymptoms.push(symptom);
      return currentSymptoms;
    },
  );
});

const { data: symptomsPerDayChartData, options: symptomsPerDayChartOptions } =
  useSymptomsPerDayChart(symptomsGroupedByDay);
const { data: averageSeverityChartData, options: averageSeverityChartOptions } =
  useAverageSeverityChart(symptomsGroupedByDay);
</script>
