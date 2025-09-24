<template>
  <section
    class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Allergy Suggestions</h2>

    <div v-if="loading" class="text-center text-gray-700 mb-2 font-medium">
      Analyzing your data...
    </div>
    <div v-else-if="error" class="text-center text-red-600 mb-2 font-medium">
      Error: {{ error }}
    </div>
    <div v-else-if="mlOverallPrediction">
      <p class="text-center text-gray-800 text-lg font-semibold mb-4">
        Overall, you might be allergic to:
        <span class="text-amber-600">{{ mlOverallPrediction }}</span>
      </p>

      <h3 class="text-lg font-semibold text-gray-700 mb-2">Hourly Breakdown:</h3>
      <ul class="list-disc list-inside text-gray-700">
        <li v-for="hourPred in mlHourlyPredictions" :key="hourPred.hour">
          Hour {{ hourPred.hour }}:
          <span v-for="(pred, index) in hourPred.predictions" :key="pred.pollenType">
            {{ pred.pollenType }}: {{ pred.prediction }}
            <span v-if="index < hourPred.predictions.length - 1">, </span>
          </span>
        </li>
      </ul>
    </div>
    <div v-else class="text-center text-gray-700 mb-2">
      Log more symptoms and pollen data to get allergy suggestions.
    </div>
  </section>
</template>

<script setup>
import { useSneezeMLPrediction } from '../composables/useSneezeMLPrediction';

const { mlOverallPrediction, mlHourlyPredictions, loading, error } = useSneezeMLPrediction();
</script>
