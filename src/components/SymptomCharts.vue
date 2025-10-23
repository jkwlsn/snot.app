<template>
  <h2>Symptom History</h2>
  <div>
    <h3>Symptoms Per Day</h3>
    <Bar
      id="symptomsPerDay"
      :options="symptomsPerDayChartOptions"
      :data="symptomsPerDayChartData"
    />
  </div>
  <div>
    <h3>Average Symptom Severity Per Day</h3>
    <Bar
      id="averageSeverity"
      :options="averageSeverityChartOptions"
      :data="averageSeverityChartData"
    />
  </div>
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
        backgroundColor: "lightgreen",
      } as ChartDataset<"bar", { x: string; y: number }[]>,
    ],
  };
});

// symptomsPerDay chart options
const symptomsPerDayChartOptions: ChartOptions<"bar"> = {
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
};

// Format symptom data for averageSeverity chart
const averageSeverityChartData = computed<
  ChartData<"bar", { x: string; y: number }[]>
>(() => {
  const severityPerDay = new Map<string, { total: number; count: number }>();

  for (const symptomRecord of symptoms.value) {
    const date = new Date(symptomRecord.timestamp).toISOString().split("T")[0];
    const severity = symptomRecord.severity;

    if (!severityPerDay.has(date)) {
      severityPerDay.set(date, { total: 0, count: 0 });
    }
    const dayData = severityPerDay.get(date)!;
    dayData.total += severity;
    dayData.count++;
  }

  const dataPoints = Array.from(severityPerDay.entries()).map(
    ([date, data]) => ({
      x: date,
      y: data.total / data.count,
    }),
  );

  return {
    datasets: [
      {
        label: "Average Severity",
        data: dataPoints,
        backgroundColor: "#FFFF66",
      } as ChartDataset<"bar", { x: string; y: number }[]>,
    ],
  };
});

const averageSeverityChartOptions: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 5,
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
};
</script>
