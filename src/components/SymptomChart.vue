<template>
  <section
    class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">
      {{ symptomName }} History
    </h2>
    <div class="overflow-x-auto">
      <div class="min-w-[600px]">
        <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
        <div v-else class="text-center text-gray-500 mt-2 italic">
          No {{ symptomName.toLowerCase() }} logged in the last 24 hours.
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

const props = defineProps({
  symptomType: {
    type: String,
    required: true,
  },
  symptomName: {
    type: String,
    required: true,
  },
});

const { symptoms } = useSymptomTracker();

const { chartOptions } = useChartOptions(() => ({
  yTitle: `Number of ${props.symptomName}`,
  legendDisplay: false,
}));

const chartData = computed(() => {
  if (!symptoms.value || symptoms.value.length === 0) return null;

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Filter symptoms by type
  const recentSymptomsOfType = symptoms.value.filter(
    (symptom) =>
      symptom.type === props.symptomType &&
      new Date(symptom.time) > twentyFourHoursAgo,
  );

  const symptomsByHour = recentSymptomsOfType.reduce((acc, symptom) => {
    const hour = new Date(symptom.time).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(symptomsByHour).map((hour) => `${hour}:00`);
  const data = Object.values(symptomsByHour);

  if (data.length === 0) return null; // Return null if no data for this symptom type

  return {
    labels,
    datasets: [
      {
        label: props.symptomName,
        data,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
      },
    ],
  };
});
</script>
