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
import { useSymptomTracker } from '../composables/useSymptomTracker';
import { useChartOptions } from '../composables/useChartOptions';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

const { symptoms } = useSymptomTracker();

const { chartOptions } = useChartOptions(() => ({
  yTitle: 'Number of Sneezes',
  legendDisplay: false,
}));

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
</script>
