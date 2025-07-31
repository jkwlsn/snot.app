<template>
  <section>
    <h2>Location</h2>
    <p v-if="loading">Getting location...</p>
    <p v-else-if="error">{{ error }}</p>
    <p v-else-if="internalLocation">
      Current location: {{ internalLocation.latitude }},
      {{ internalLocation.longitude }}
    </p>
    <button @click="refreshLocation">Refresh Location</button>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useGeoLocation } from '../composables/useGeoLocation';
const props = defineProps({
  location: Object,
});
const emit = defineEmits(['update:location']);

const {
  location: internalLocation,
  loading,
  error,
  getLocation,
} = useGeoLocation();

// Watch composable location changes, emit updates
watch(internalLocation, (val) => {
  if (JSON.stringify(val) !== JSON.stringify(props.location)) {
    emit('update:location', val);
  }
});

// Sync prop changes into composable
watch(
  () => props.location,
  (val) => {
    if (JSON.stringify(val) !== JSON.stringify(internalLocation.value)) {
      internalLocation.value = val;
    }
  },
);

function refreshLocation() {
  getLocation();
}
</script>
