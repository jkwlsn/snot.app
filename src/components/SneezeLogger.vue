<template>
  <section
    class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg"
  >
    
    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Symptom Tracker</h2>
    <div
      v-if="!isGeolocationEnabled"
      class="text-red-600 text-center mb-4 font-medium"
    >
      Please enable location services to log symptoms.
    </div>
    <div class="flex flex-col items-center mb-4">
      <label
        for="sneeze-severity"
        class="block text-gray-700 text-base font-medium mb-2"
      >
        Sneeze Severity: {{ sneezeSeverity }}
      </label>
      <input
        type="range"
        id="sneeze-severity"
        min="1"
        max="5"
        step="1"
        v-model.number="sneezeSeverity"
        class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-amber-500"
      />
      <button
        @click="handleLogSneeze"
        :disabled="!isGeolocationEnabled"
        class="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-75 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        Log Sneeze 🤧
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSymptomTracker } from '../composables/useSymptomTracker';
import { useSneezePrediction } from '../composables/useSneezePrediction';
import { useNotifications } from '../composables/useNotifications';

const { logSneeze, isGeolocationEnabled } = useSymptomTracker();
const { prediction } = useSneezePrediction();
const { requestPermission, sendNotification } = useNotifications();

const sneezeSeverity = ref(3);

onMounted(() => {
  requestPermission();
});

const handleLogSneeze = () => {
  if (prediction.value === 'No') {
    sendNotification('So sorry!', {
      body: 'Our prediction was wrong. Thanks for helping us improve!',
      icon: '/favicon.ico',
    });
  }
  logSneeze(sneezeSeverity.value);
};
</script>
