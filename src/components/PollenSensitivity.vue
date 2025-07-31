<template>
  <div>
    <h2>Pollen Sensitivity</h2>
    <label for="sensitivity">Pollen Sensitivity: {{ sensitivity }}</label>
    <input
      id="sensitivity"
      type="range"
      :min="min"
      :max="max"
      step="1"
      v-model.number="sensitivity"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserSettings } from '../composables/useUserSettings.js';

const { settings } = useUserSettings();
const min = 1;
const max = 10;

const sensitivity = computed({
  get: () => settings.value.sensitivity,
  set: (val) => (settings.value.sensitivity = val),
});
</script>

<style>
input {
  display: block;
}
</style>
