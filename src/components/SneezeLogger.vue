<template>
  <section
    class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Symptom Tracker</h2>
    <div
      v-if="!hasActiveLocation"
      class="text-red-600 text-center mb-4 font-medium"
    >
      Please enable location services to log symptoms.
    </div>
    <div class="flex flex-col items-center mb-4">
      <!-- Symptom Type Selection Checkboxes -->
      <label class="block text-gray-700 text-base font-medium mb-2">
        Select Symptoms:
      </label>
      <div class="flex flex-wrap justify-center gap-2 mb-4">
        <div v-for="symptom in availableSymptoms" :key="symptom.id" class="flex items-center">
          <input
            type="checkbox"
            :id="`symptom-${symptom.id}`"
            :value="symptom.id"
            v-model="selectedSymptomTypes"
            class="mr-1 h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-300 rounded"
          />
          <label :for="`symptom-${symptom.id}`" class="text-gray-700 text-sm">
            {{ symptom.name }}
          </label>
        </div>
      </div>

      <label
        for="symptom-severity"
        class="block text-gray-700 text-base font-medium mb-2"
      >
        Severity: {{ symptomSeverity }}
      </label>
      <input
        type="range"
        id="symptom-severity"
        min="1"
        max="5"
        step="1"
        v-model.number="symptomSeverity"
        class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-amber-500"
      />
      <button
        @click="handleLogSymptom"
        :disabled="!hasActiveLocation || selectedSymptomTypes.length === 0"
        class="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-75 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        Log Symptom
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSymptomTracker } from '../composables/useSymptomTracker';
import { useSneezePrediction } from '../composables/useSneezePrediction';
import { useNotifications } from '../composables/useNotifications';
import { settings } from '../composables/useUserSettings'; // Import settings directly
import { usePollenData } from '../composables/usePollenData';
import { DEFAULT_SYMPTOMS } from '../symptoms';

const { logSymptom, hasActiveLocation } = useSymptomTracker();
const { prediction } = useSneezePrediction();
const { requestPermission, sendNotification } = useNotifications();
// settings is now directly imported
const { parsedData } = usePollenData();

const symptomSeverity = ref(3);
const selectedSymptomTypes = ref([]); // Changed to array for multiple selections

const availableSymptoms = computed(() => {
  const defaultSymptoms = Object.entries(DEFAULT_SYMPTOMS).map(
    ([id, name]) => ({ id, name }),
  );
  return [...defaultSymptoms, ...(settings.value.custom_symptoms || [])];
});

onMounted(() => {
  requestPermission();
});

const handleLogSymptom = () => {
  if (selectedSymptomTypes.value.includes('sneeze') && prediction.value === 'No') {
    sendNotification('So sorry!', {
      body: 'Our prediction was wrong. Thanks for helping us improve!',
      icon: '/favicon.ico',
    });
  }

  let relevantPollenData = null;
  if (parsedData.value && parsedData.value.time && settings.value.selected_pollens) {
    const currentHour = new Date().getHours();
    const timeIndex = parsedData.value.time.findIndex(
      (timeStr) => new Date(timeStr).getHours() === currentHour
    );

    if (timeIndex !== -1) {
      relevantPollenData = {
        selected_pollens: settings.value.selected_pollens,
        hourly_data: {}
      };
      for (const pollenType in settings.value.selected_pollens) {
        if (parsedData.value[pollenType] && parsedData.value[pollenType][timeIndex] !== undefined) {
          relevantPollenData.hourly_data[pollenType] = parsedData.value[pollenType][timeIndex];
        }
      }
    }
  }

  selectedSymptomTypes.value.forEach(symptomType => {
    logSymptom(symptomType, symptomSeverity.value, relevantPollenData);
  });
  selectedSymptomTypes.value = []; // Clear selections after logging
  symptomSeverity.value = 3; // Reset severity
};
</script>