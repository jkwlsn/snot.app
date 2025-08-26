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
import { ref, computed, onMounted, onUnmounted } from 'vue';
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
import { POLLEN_DISPLAY_NAMES } from '../pollen.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const { parsedData } = usePollenData();

const chartData = computed(() => {
  if (!parsedData.value) return null;

  const labels = parsedData.value.time.map(t => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const datasets = [];

  for (const pollen in parsedData.value) {
    if (pollen !== 'time') {
      datasets.push({
        label: POLLEN_DISPLAY_NAMES[pollen] || pollen,
        data: parsedData.value[pollen],
        backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`,
      });
    }
  }

  return { labels, datasets };
});

const chartOptions = ref({});

const updateChartOptions = () => {
  const isMobile = window.innerWidth < 768;
  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Pollen Count',
        },
      },
      x: {
        ticks: {
          maxRotation: isMobile ? 90 : 0,
          minRotation: isMobile ? 90 : 0,
        },
      },
    },
    plugins: {
      legend: {
        display: !isMobile,
      },
    },
  };
};

onMounted(() => {
  updateChartOptions();
  window.addEventListener('resize', updateChartOptions);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateChartOptions);
});
</script>
