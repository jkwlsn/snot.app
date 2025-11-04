<template>
  <p v-if="symptoms.length == 0">No data</p>
  <Pre v-else
    ><template #content>{{ symptoms }}</template></Pre
  >
</template>

<script setup lang="ts">
import { useSymptoms } from "../composables/useSymptoms";
import Pre from "./Pre.vue";

const { symptoms } = useSymptoms();
</script>
