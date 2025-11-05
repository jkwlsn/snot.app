<template>
  <h3>{{ props.chartTitle }}</h3>
  <p
    v-if="props.data.datasets.length == 0"
    class="text-center text-gray-500 mt-2"
  >
    No data
  </p>
  <Line v-else :id="props.id" :options="props.options" :data="props.data" />
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
);

interface Props {
  id: string;
  chartTitle: string;
  data: ChartData<"line">;
  options: ChartOptions<"line">;
}
const props = defineProps<Props>();
</script>
