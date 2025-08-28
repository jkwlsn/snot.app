<script setup>
import { computed } from 'vue'; // Import computed
import SneezePrediction from '../components/SneezePrediction.vue';
// import SneezeChart from '../components/SneezeChart.vue'; // Remove this
import SneezeLogger from '../components/SneezeLogger.vue';
import SneezeMatrix from '../components/SneezeMatrix.vue';
import PollenAlerts from '../components/PollenAlerts.vue';
import PollenChart from '../components/PollenChart.vue';
import SymptomChart from '../components/SymptomChart.vue'; // New import
import { useUserSettings } from '../composables/useUserSettings'; // New import
import { useSymptomTracker } from '../composables/useSymptomTracker'; // New import

const { settings } = useUserSettings();
const { symptoms } = useSymptomTracker();

const availableSymptoms = computed(() => {
  const defaultSymptom = { id: 'sneeze', name: 'Sneeze' };
  return [defaultSymptom, ...(settings.value.custom_symptoms || [])];
});

// Function to check if there's any data for a given symptom type
const hasSymptomData = (symptomType) => {
  return symptoms.value.some(symptom => symptom.type === symptomType);
};
</script>

<template>
  <div>
    <SneezePrediction />
    <PollenAlerts />
    <SneezeLogger />
    <PollenChart />
    <SneezeMatrix />

    <!-- Dynamically render SymptomChart for each symptom type with data -->
    <template v-for="symptom in availableSymptoms" :key="symptom.id">
      <SymptomChart
        v-if="hasSymptomData(symptom.id)"
        :symptomType="symptom.id"
        :symptomName="symptom.name"
      />
    </template>
  </div>
</template>
