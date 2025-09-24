<script setup>
import { computed } from 'vue';
import SymptomChart from '../components/SymptomChart.vue';
import { settings } from '../composables/useUserSettings'; // Import settings directly
import { useSymptomTracker } from '../composables/useSymptomTracker';
import { DEFAULT_SYMPTOMS } from '../symptoms';

// settings is now directly imported
const { symptoms } = useSymptomTracker();

const availableSymptoms = computed(() => {
  const defaultSymptoms = Object.entries(DEFAULT_SYMPTOMS).map(
    ([id, name]) => ({ id, name }),
  );
  return [...defaultSymptoms, ...(settings.value.custom_symptoms || [])];
});

const hasSymptomData = (symptomType) => {
  return symptoms.value.some((symptom) => symptom.type === symptomType);
};
</script>

<template>
  <div>
    <template v-for="symptom in availableSymptoms" :key="symptom.id">
      <SymptomChart
        v-if="hasSymptomData(symptom.id)"
        :symptomType="symptom.id"
        :symptomName="symptom.name"
      />
    </template>
  </div>
</template>