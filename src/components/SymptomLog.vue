<template>
  <p v-if="symptoms.length == 0">No data</p>
  <pre v-else> {{ symptoms }} </pre>
</template>

<script setup lang="ts">
import { useSymptoms } from "../composables/useSymptoms";

const { symptoms } = useSymptoms();
</script>
