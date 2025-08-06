<template>
  <div>
    <h2>Pollen Sensitivities</h2>

    <div v-for="pollen in pollens" :key="pollen" class="slider-row">
      <label :for="pollen">
        {{ pollen }}: {{ sensitivities[pollen] || 0 }}
      </label>
      <input
        type="range"
        :id="pollen"
        min="0"
        max="10"
        step="1"
        v-model.number="sensitivities[pollen]"
      />
    </div>

    <button @click="clearAll" class="clear-button">Clear All</button>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { useUserSettings } from '../composables/useUserSettings.js';

const rawPollens = import.meta.env.VITE_POLLENS || '';
const pollens = rawPollens
  .split(',')
  .map((p) => p.trim())
  .filter(Boolean);

const { settings } = useUserSettings();

const sensitivities = reactive({});

// Initialize sensitivities
pollens.forEach((pollen) => {
  sensitivities[pollen] =
    (settings.value.selected_pollens &&
      settings.value.selected_pollens[pollen]) ||
    0;
});

// Sync with settings
watch(
  sensitivities,
  (newVals) => {
    settings.value.selected_pollens = Object.fromEntries(
      Object.entries(newVals).filter(([, val]) => val > 0),
    );
  },
  { deep: true },
);

// Clear all sensitivities
function clearAll() {
  pollens.forEach((pollen) => {
    sensitivities[pollen] = 0;
  });
}
</script>

<style>
.slider-row {
  margin-bottom: 1em;
}
</style>
