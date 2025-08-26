<template>
  <section>
    <h2>Will I Sneeze Today?</h2>
    <div>{{ predictionIcon }} {{ prediction }}</div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useSneezePrediction } from '../composables/useSneezePrediction';

const { prediction } = useSneezePrediction();

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
