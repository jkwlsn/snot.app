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
import { ref, watch } from 'vue';
import { usePollenSensitivity } from '../composables/usePollenSensitivity';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(['update:modelValue']);
const { clamp, min, max } = usePollenSensitivity(props.min, props.max);

const sensitivity = ref(clamp(props.modelValue));

watch(
  sensitivity,
  (newVal) => {
    const clamped = clamp(newVal);
    if (clamped !== newVal) {
      sensitivity.value = clamped; // re-clamp if out of bounds
    }
    emit('update:modelValue', clamped);
  },
  { immediate: false },
);

watch(
  () => props.modelValue,
  (val) => {
    if (val !== sensitivity.value) {
      sensitivity.value = clamp(val);
    }
  },
);
</script>

<style>
input {
  display: block;
}
</style>
