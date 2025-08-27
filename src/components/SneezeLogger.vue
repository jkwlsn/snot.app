<template>
  <section>
    <h2>Symptom Tracker</h2>
    <div
      v-if="!isGeolocationEnabled"
    >
      Please enable location services to log symptoms.
    </div>
    <div>
      <label
        for="sneeze-severity"
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
      />
      <button
        @click="handleLogSneeze"
        :disabled="!isGeolocationEnabled"
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
    sendNotification('Sorry!', {
      body: 'Our prediction was wrong. Thanks for helping us improve!',
      icon: '/favicon.ico',
    });
  }
  logSneeze(sneezeSeverity.value);
};
</script>
