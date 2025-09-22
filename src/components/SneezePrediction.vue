<template>
  <section
    class="flex flex-row text-lg font-bold p-2 bg-emerald-300 rounded-md"
  >
    <h2 class="text-gray-800">Will I Sneeze Today?</h2>
    <p v-if="isLoading" class="text-yellow-500 pl-2">🙃 Maybe?</p>
    <p v-else-if="!prediction && !isLoading" class="text-gray-500 pl-2 text-sm">ML Unavailable (log more data)</p>
    <div v-else class="pl-2" :class="predictionClass">
      {{ predictionIcon }} {{ predictionLabel }}
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useSneezePrediction } from '../composables/useSneezePrediction';
import { usePollenData } from '../composables/usePollenData';
import { PREDICTION_CATEGORIES } from '../config';

const { prediction } = useSneezePrediction();
const { isLoading } = usePollenData();

const predictionClass = computed(() => {
  const category = prediction.value;
  switch (category) {
    case 'yes':
      return 'text-red-500';
    case 'maybe':
      return 'text-yellow-500';
    case 'no':
      return 'text-green-500';
    default:
      return 'text-yellow-500';
  }
});

const predictionIcon = computed(() => {
  const category = prediction.value;
  return PREDICTION_CATEGORIES[category]?.emoji || PREDICTION_CATEGORIES.maybe.emoji;
});

const predictionLabel = computed(() => {
  const category = prediction.value;
  return PREDICTION_CATEGORIES[category]?.label || PREDICTION_CATEGORIES.maybe.label;
});
</script>
