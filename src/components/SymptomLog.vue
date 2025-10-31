<template>
  <section>
    <h2>Symptom History</h2>
    <p v-if="symptoms.length == 0">No data</p>
    <pre v-else>{{ symptoms }}</pre>
  </section>
</template>

<script setup lang="ts">
import { useSymptoms } from "../composables/useSymptoms";

const { symptoms } = useSymptoms();
</script>
