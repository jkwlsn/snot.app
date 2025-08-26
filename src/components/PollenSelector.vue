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

      <button
        type="button"
        @click="clearAll"
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

<style>
.slider-row {
  margin-bottom: 1em;
}
</style>
