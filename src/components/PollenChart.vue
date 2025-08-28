<template>
  <section>
    <h2>Pollen Forecast</h2>
    <div>
      <div>
        <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
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
  LinearScale
);

const { parsedData } = usePollenData();
const { getSeverity } = usePollenSeverity();

const { chartOptions } = useChartOptions(({ isMobile }) => ({
  yTitle: 'Pollen Count',
  legendDisplay: !isMobile,
}));

const chartData = computed(() => {
  if (!parsedData.value || !parsedData.value.time) return null;

  const labels = parsedData.value.time.map(t => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const datasets = [];
  let colorIndex = 0;

  for (const pollen in parsedData.value) {
    if (pollen !== 'time') {
      datasets.push({
        label: POLLEN_DISPLAY_NAMES[pollen] || pollen,
        data: parsedData.value[pollen],
        backgroundColor: POLLEN_CHART_COLORS[colorIndex % POLLEN_CHART_COLORS.length],
      });
      colorIndex++;
    }
  }

  return { labels, datasets };
});

chartOptions.value.plugins = {
  tooltip: {
    callbacks: {
      label: function(context) {
        const label = context.dataset.label || '';
        if (label) {
          const value = context.parsed.y;
          const pollenKey = Object.keys(POLLEN_DISPLAY_NAMES).find(key => POLLEN_DISPLAY_NAMES[key] === label);
          if (pollenKey) {
            const severity = getSeverity(pollenKey, value);
            return `${label}: ${value} (${severity.label} ${severity.emoji})`;
          }
        }
        return context.parsed.y;
      }
    }
  }
};
</script>
