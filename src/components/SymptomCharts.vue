<template>
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
    <div>
      <ChartDoughnut
        id="symptomsPerTotal"
        chartTitle="Symptom Type Distribution"
        :data="symptomsPerTotalChartData"
        :options="symptomsPerTotalChartOptions"
      />
    </div>
    <div>
      <ChartDoughnut
        id="pollenTypes"
        chartTitle="Pollen Types in Symptoms"
        :data="pollenTypeChartData"
        :options="pollenTypeChartOptions"
      />
    </div>
</template>

<script setup lang="ts">
import ChartBarPerDay from "./ChartBarPerDay.vue";
import ChartDoughnut from "./ChartDoughnut.vue";
import { useSymptoms } from "../composables/useSymptoms";
import { useSymptomsPerDayChart } from "../composables/useSymptomsPerDayChart";
import { useAverageSeverityChart } from "../composables/useAverageSeverityChart";
import { useSymptomsPerTotalChart } from "../composables/useSymptomsPerTotalChart";
import { computed } from "vue";
import type { SymptomRecord } from "../interfaces/SymptomRecord";
import { aggregateSymptomsByDay } from "../utils/chartDataAggregator";
import { usePollenTypePerTotalChart } from "../composables/usePollenTypePerTotalChart";

// Load symptom data
const { symptoms } = useSymptoms();

// Pre-aggregate symptoms by day once in the parent component (for bar charts)
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

// Load data and options for symptom type doughnut chart
const {
  data: symptomsPerTotalChartData,
  options: symptomsPerTotalChartOptions,
} = useSymptomsPerTotalChart(symptoms);

const { data: pollenTypeChartData, options: pollenTypeChartOptions } =
  usePollenTypePerTotalChart(symptoms);
</script>
