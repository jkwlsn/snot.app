<script setup lang="ts">
import SymptomInput from "./components/SymptomInput.vue";
import SymptomLog from "./components/SymptomLog.vue";
import SymptomCharts from "./components/SymptomCharts.vue";
import GeolocationInput from "./components/GeolocationInput.vue";
import PollenData from "./components/PollenData.vue";
import PollenDataFilter from "./components/PollenDataFilter.vue";
import PollenForecastChart from "./components/PollenForecastChart.vue";
import About from "./components/About.vue";
import Card from "./components/Card.vue";
</script>

<template>
  <Card>
    <template #content>
      <About />
    </template>
  </Card>
  <Card>
    <template #content>
      <GeolocationInput />
    </template>
  </Card>
  <Card>
    <template #content>
      <PollenForecastChart />
    </template>
  </Card>
  <Card>
    <template #content>
      <SymptomInput />
    </template>
  </Card>
  <Card>
    <template #content>
      <SymptomCharts />
    </template>
  </Card>
  <Card>
    <template #content>
      <SymptomLog />
    </template>
  </Card>
  <Card>
    <template #content>
      <PollenDataFilter />
    </template>
  </Card>
  <Card>
    <template #content>
      <PollenData />
    </template>
  </Card>
</template>

<style scoped></style>
