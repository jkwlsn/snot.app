<template>
  <section
    class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">
      Will I Sneeze Today?
    </h2>
    <div class="text-6xl font-bold my-4 text-center" :class="predictionClass">
      {{ predictionIcon }} {{ prediction }}
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useSneezePrediction } from '../composables/useSneezePrediction';

const { prediction } = useSneezePrediction();

const predictionClass = computed(() => {
  switch (prediction.value) {
    case 'Yes':
      return 'text-red-500';
    case 'Maybe':
      return 'text-yellow-500';
    case 'No':
      return 'text-green-500';
    default:
      return 'text-gray-400';
  }
});

const predictionIcon = computed(() => {
  switch (prediction.value) {
    case 'Yes':
      return '😭'; // Crying face
    case 'Maybe':
      return '😐'; // Neutral face
    case 'No':
      return '😀'; // Grinning face
    default:
      return '';
  }
});
</script>
