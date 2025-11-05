<template>
  <h3>{{ props.chartTitle }}</h3>
  <p
    v-if="props.data.datasets[0].data.length == 0"
    class="text-center text-gray-500 mt-2"
  >
    No data
  </p>
  <Bar v-else :id="props.id" :options="props.options" :data="props.data" />
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
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, LinearScale, TimeScale);

interface Props {
  id: string;
  chartTitle: string;
  data: ChartData<"bar", { x: number; y: number }[]>;
  options: ChartOptions<"bar">;
}
const props = defineProps<Props>();
</script>
