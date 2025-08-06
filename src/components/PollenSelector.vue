<template>
  <div>
    <h2>Select pollens:</h2>
    <div v-for="(pollen, index) in pollens" :key="index">
      <label>
        <input type="checkbox" v-model="selectedPollens" :value="pollen" />
        {{ pollen }}
      </label>
    </div>

    <div class="output">
      <p>Selected: {{ selectedPollens.join(', ') }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserSettings } from '../composables/useUserSettings.js';

const { settings } = useUserSettings();
const rawPollens = import.meta.env.VITE_POLLENS || '';
const pollens = rawPollens
  .split(',')
  .map((i) => i.trim())
  .filter(Boolean);

const selectedPollens = computed({
  get: () => settings.value.selectedPollens,
  set: (val) => (settings.value.selectedPollens = val),
});
</script>
