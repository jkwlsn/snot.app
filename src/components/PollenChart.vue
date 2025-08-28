<template>
  <section
    class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">
      Pollen Forecast
    </h2>
    <p v-if="isLoading" class="text-center text-gray-700 mb-2 font-medium">
      Loading pollen forecast...
    </p>
    <p v-else-if="fetchError" class="text-center text-red-600 mb-2 font-medium">
      Error: {{ fetchError }}
    </p>
    <div v-else class="overflow-x-auto">
      <div class="min-w-[600px]">
        <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
        <div v-else class="text-center text-gray-500 mt-2 italic">
          No pollen data available.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { usePollenData } from '../composables/usePollenData';
import { useChartOptions } from '../composables/useChartOptions';
import { POLLEN_DISPLAY_NAMES, POLLEN_CHART_COLORS } from '../pollen.js';
import { usePollenSeverity } from '../composables/usePollenSeverity';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

const { parsedData, isLoading, fetchError } = usePollenData(); // Destructure isLoading and fetchError
const { getSeverity } = usePollenSeverity();

const { chartOptions } = useChartOptions(({ isMobile }) => ({
  yTitle: 'Pollen Count',
  legendDisplay: !isMobile,
}));

const chartData = computed(() => {
  if (!parsedData.value || !parsedData.value.time) return null;

  const labels = parsedData.value.time.map((t) =>
    new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  );
  const datasets = [];
  let colorIndex = 0;

  for (const pollen in parsedData.value) {
    if (pollen !== 'time') {
      datasets.push({
        label: POLLEN_DISPLAY_NAMES[pollen] || pollen,
        data: parsedData.value[pollen],
        backgroundColor:
          POLLEN_CHART_COLORS[colorIndex % POLLEN_CHART_COLORS.length],
      });
      colorIndex++;
    }
  }

  return { labels, datasets };
});

chartOptions.value.plugins = {
  tooltip: {
    callbacks: {
      label: function (context) {
        const label = context.dataset.label || '';
        if (label) {
          const value = context.parsed.y;
          const pollenKey = Object.keys(POLLEN_DISPLAY_NAMES).find(
            (key) => POLLEN_DISPLAY_NAMES[key] === label,
          );
          if (pollenKey) {
            const severity = getSeverity(pollenKey, value);
            return `${label}: ${value} (${severity.label} ${severity.emoji})`;
          }
        }
        return context.parsed.y;
      },
    },
  },
};
</script>
