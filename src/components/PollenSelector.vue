<template>
  <section
    class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">
      Pollen Sensitivities
    </h2>
    <form>
      <div v-for="pollen in pollens" :key="pollen" class="mb-4">
        <label
          :for="pollen"
          class="block text-gray-700 text-base font-medium mb-2"
        >
          {{ POLLEN_DISPLAY_NAMES[pollen] || pollen }}:
          {{ sensitivities[pollen] || 0 }}
        </label>
        <input
          type="range"
          :id="pollen"
          min="0"
          max="10"
          step="1"
          v-model.number="sensitivities[pollen]"
          class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>

      <button
        type="button"
        @click="clearAll"
        class="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 transition-colors duration-200"
      >
        Clear All
      </button>
    </form>
  </section>
</template>

<script setup>
import { usePollenSelector } from '../composables/usePollenSelector.js';
import { POLLEN_DISPLAY_NAMES } from '../pollen.js';

const { pollens, sensitivities, clearAll } = usePollenSelector();
</script>
