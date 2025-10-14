<script setup lang="ts">
import SymptomInput from "./components/SymptomInput.vue";
import SymptomLog from "./components/SymptomLog.vue";
import GeolocationInput from "./components/GeolocationInput.vue";
import PollenData from "./components/PollenData.vue";
import PollenDataFilter from "./components/PollenDataFilter.vue";
</script>

<template>
  <GeolocationInput />
  <SymptomInput />
  <SymptomLog />
  <PollenDataFilter />
  <PollenData />
</template>

<style scoped></style>
