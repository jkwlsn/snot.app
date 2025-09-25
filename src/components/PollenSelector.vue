<template>
  <section
    class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Allergens</h2>
    <form>
      <div class="flex flex-row justify-center gap-4 py-4">
        <div v-for="pollen in pollens" :key="pollen">
          <input
            type="checkbox"
            :id="pollen"
            v-model="allergens[pollen]"
            class="peer sr-only"
          />
          <label
            :for="pollen"
            class="cursor-pointer font-semibold text-amber-600 py-2 px-4 rounded-lg inset-ring-2 peer-checked:text-white inset-ring-amber-500 hover:inset-ring-amber-600 peer-checked:bg-amber-500 peer-checked:hover:bg-amber-600 duration-100 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-400 peer-focus:ring-opacity-75"
          >
            {{ POLLEN_DISPLAY_NAMES[pollen] || pollen }}
          </label>
        </div>
      </div>
      <div class="flex flex-row justify-center gap-4">
        <button
          type="button"
          @click="selectAll"
          class="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 transition-colors duration-200 mt-4"
        >
          Select All
        </button>

        <button
          type="button"
          @click="clearAll"
          class="cursor-pointer bg-red-400 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors duration-200 mt-4"
        >
          Clear All
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { usePollenSelector } from '../composables/usePollenSelector.js';
import { POLLEN_DISPLAY_NAMES } from '../pollen.js';

const { pollens, allergens, selectAll, clearAll } = usePollenSelector();
</script>
