<script setup lang="ts">
import SymptomInput from "./components/SymptomInput.vue";
import SymptomLog from "./components/SymptomLog.vue";
import GeolocationInput from "./components/GeolocationInput.vue";
import PollenData from "./components/PollenData.vue";
import PollenDataPicker from "./components/PollenDataPicker.vue";
</script>

<template>
  <GeolocationInput />
  <SymptomInput />
  <SymptomLog />
  <PollenDataPicker />
  <PollenData />
</template>

<style scoped></style>
