<template>
  <section
    class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Allergens</h2>
    <form>
      <div class="flex flex-row justify-center gap-4">
        <div v-for="pollen in pollens" :key="pollen">
          <input
            type="checkbox"
            :id="pollen"
            v-model="allergens[pollen]"
            class="peer sr-only"
          />
          <label
            :for="pollen"
            class="cursor-pointer py-2 px-4 inset-ring-2 inset-ring-amber-400 rounded-md peer-checked:inset-ring-amber-400 peer-checked:bg-amber-400 hover:bg-amber-600 hover:inset-ring-amber-600 duration-100"
          >
            {{ POLLEN_DISPLAY_NAMES[pollen] || pollen }}
          </label>
        </div>
      </div>
      <div class="flex flex-row justify-center gap-4">
        <button
          type="button"
          @click="selectAll"
          class="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 transition-colors duration-200 mt-4"
        >
          Select All
        </button>

        <button
          type="button"
          @click="clearAll"
          class="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 transition-colors duration-200 mt-4"
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
