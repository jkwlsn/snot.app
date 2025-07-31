<template>
  <section>
    <h2>Location</h2>
    <p v-if="loading">Getting location...</p>
    <p v-else-if="error">{{ error }}</p>
    <p v-else-if="settings.location">
      Current location: {{ settings.location.latitude }}, {{ settings.location.longitude }}
    </p>
    <button @click="getLocation" :disabled="loading">Refresh Location</button>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserSettings } from '../composables/useUserSettings';
import { useGeoLocation } from '../composables/useGeoLocation';

const { settings } = useUserSettings();
const { loading, error, getLocation } = useGeoLocation();

function refreshLocation() {
  getLocation();
}

onMounted(() => {
  if (!settings.value.location) {
    getLocation();
  }
});
</script>
