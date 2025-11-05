<template>
  <h3>{{ props.chartTitle }}</h3>
  <p
    v-if="props.data.datasets[0].data.length == 0"
    class="text-center text-gray-500 mt-2"
  >
    No data
  </p>
  <Doughnut v-else :id="props.id" :options="props.options" :data="props.data" />
</template>

<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

interface Props {
  id: string;
  chartTitle: string;
  data: ChartData<"doughnut">;
  options: ChartOptions<"doughnut">;
}
const props = defineProps<Props>();
</script>
