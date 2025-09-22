<template>
  <section
    class="flex flex-row text-lg font-bold p-2 bg-emerald-300 rounded-md"
  >
    <h2 class="text-gray-800">Will I Sneeze Today?</h2>
    <p v-if="isLoading" class="text-yellow-500 pl-2">🙃 Maybe?</p>
    <div v-else class="pl-2" :class="predictionClass">
      {{ predictionIcon }} {{ prediction }}
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useSneezePrediction } from '../composables/useSneezePrediction';
import { usePollenData } from '../composables/usePollenData';

const { prediction } = useSneezePrediction();
const { isLoading } = usePollenData();

const predictionClass = computed(() => {
  switch (prediction.value) {
    case 'Yes':
      return 'text-red-500';
    case 'Maybe':
      return 'text-yellow-500';
    case 'No':
      return 'text-green-500';
    default:
      return 'text-yellow-500';
  }
});

const predictionIcon = computed(() => {
  switch (prediction.value) {
    case 'Yes':
      return '😭';
    case 'Maybe':
      return '🙃';
    case 'No':
      return '😀';
    default:
      return '🙃';
  }
});
</script>
