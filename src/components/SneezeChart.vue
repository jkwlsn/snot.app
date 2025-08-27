<template>
  <section>
    <h2>
      Sneeze History
    </h2>
    <div>
      <div>
        <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
        <div v-else>
          No sneezes logged in the last 24 hours.
        </div>
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
import { useSymptomTracker } from '../composables/useSymptomTracker';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

const { symptoms } = useSymptomTracker();

const chartData = computed(() => {
  if (!symptoms.value || symptoms.value.length === 0) return null;

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const recentSneezes = symptoms.value.filter(sneeze => new Date(sneeze.time) > twentyFourHoursAgo);

  const sneezesByHour = recentSneezes.reduce((acc, sneeze) => {
    const hour = new Date(sneeze.time).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(sneezesByHour).map((hour) => `${hour}:00`);
  const data = Object.values(sneezesByHour);

  return {
    labels,
    datasets: [
      {
        label: 'Sneezes',
        data,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
      },
    ],
  };
});

const chartOptions = ref({});

const updateChartOptions = () => {
  const isMobile = window.innerWidth < 768;
  const isDarkMode = document.documentElement.classList.contains('dark');

  const textColor = isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(31, 41, 55)'; // gray-100 vs gray-800
  const gridColor = isDarkMode ? 'rgba(243, 244, 246, 0.2)' : 'rgba(31, 41, 55, 0.2)';
  const tooltipBgColor = isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)';

  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Sneezes',
          color: textColor,
        },
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          maxRotation: isMobile ? 90 : 0,
          minRotation: isMobile ? 90 : 0,
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: tooltipBgColor,
        titleColor: textColor,
        bodyColor: textColor,
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
