<template>
  <pre> {{ symptoms }} </pre>
</template>

<script setup lang="ts">
import { useSymptoms } from "../composables/useSymptoms";

const { symptoms } = useSymptoms();
</script>
