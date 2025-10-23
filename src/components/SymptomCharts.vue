<template>
  <h2>Symptom History</h2>
  <canvas id="symptoms-per-day"></canvas>
</template>

<script setup lang="ts">
import Chart from "chart.js/auto";
import { useSymptoms } from "../composables/useSymptoms";
import { onMounted, watch, computed } from "vue";
import { ChartData, ChartDataset } from "../interfaces/ChartData";

// Load symptom data
const { symptoms } = useSymptoms();

// Declare chart variable which will contain chart data and options etc.
let chart: Chart<"bar", { x: string; y: number }[], string> | null = null;

// Compute chartData: Turn the symptoms data into the correct structure for Chart.js charts.
// This reduces the symptom data and creates a new list of objects with a string key (timestamp) and a value (symptoms per day)
const chartData = computed(() => {
  const symptomsPerDay = symptoms.value.reduce(
    (accumulator, symptom) => {
      const date = new Date(symptom.timestamp).toLocaleDateString();
      accumulator[date] = (accumulator[date] || 0) + 1;
      return accumulator;
    },
    {} as Record<string, number>,
  );

  const dataPoints = Object.keys(symptomsPerDay)
    .sort()
    .map((date) => ({
      x: date,
      y: symptomsPerDay[date],
    }));

  return {
    labels: dataPoints.map((point) => point.x),
    datasets: [
      {
        label: "Symptoms per day",
        data: dataPoints,
      } as ChartDataset,
    ],
  } as ChartData;
});

// This function updates the chart.data with the computed chartData value
const updateChart = () => {
  if (!chart) return;
  chart.data = chartData.value;
  chart.update();
};

// Init the chart on component mount
// Provide basic values
onMounted(() => {
  const ctx = document.getElementById("symptoms-per-day") as HTMLCanvasElement;
  if (!ctx) return;

  chart = new Chart(ctx, {
    type: "bar",
    data: chartData.value,
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
        x: {
          type: "category",
        },
      },
    },
  });

  watch(symptoms, updateChart, { deep: true });
});
</script>
