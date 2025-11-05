<template>
  <SymptomDataTable :records="symptoms" />
</template>

<script setup lang="ts">
import { useSymptoms } from "../composables/useSymptoms";
import SymptomDataTable from "./SymptomDataTable.vue";

const { symptoms } = useSymptoms();
</script>
