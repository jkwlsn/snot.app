<template>
  <h2>Symptom History</h2>
  <Bar :options="chartOptions" :data="symptomsPerDayChartData" />
</template>

<script setup lang="ts">
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { useSymptoms } from "../composables/useSymptoms";
import { computed } from "vue";
import type { ChartData, ChartDataset, ChartOptions } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, LinearScale, TimeScale);

// Load symptom data
const { symptoms } = useSymptoms();

// Compute chartData: Turn the symptoms data into the correct structure for Chart.js charts.
const symptomsPerDayChartData = computed<
  ChartData<"bar", { x: string; y: number }[]>
>(() => {
  const symptomsPerDay = new Map<string, number>();
  for (const symptom of symptoms.value) {
    const date = new Date(symptom.timestamp).toISOString().split("T")[0];
    symptomsPerDay.set(date, (symptomsPerDay.get(date) || 0) + 1);
  }

  const dataPoints = Array.from(symptomsPerDay.entries()).map(
    ([date, count]) => ({
      x: date,
      y: count,
    }),
  );

  return {
    datasets: [
      {
        label: "Symptoms per day",
        data: dataPoints,
      } as ChartDataset<"bar", { x: string; y: number }[]>,
    ],
  };
});

const chartOptions: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
    x: {
      type: "time",
      time: {
        unit: "day",
      },
    },
  },
  elements: { bar: { backgroundColor: "lightgreen" } },
};
</script>
