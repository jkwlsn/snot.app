<template>
  <section>
    <h2>Symptom Tracker</h2>
    <div v-if="!isGeolocationEnabled">
      Please enable location services to log symptoms.
    </div>
    <div>
      <label for="sneeze-severity">Sneeze Severity: {{ sneezeSeverity }}</label>
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
    <div>
      <h3>Recent Sneezes</h3>
      <ul v-if="symptoms.length">
        <li v-for="symptom in symptoms" :key="symptom.id">
          <div><strong>Time:</strong> {{ new Date(symptom.time).toLocaleString() }}</div>
          <div><strong>Severity:</strong> {{ symptom.severity }}</div>
          <div>
            <strong>Location:</strong>
            {{ symptom.location.latitude.toFixed(4) }}, {{ symptom.location.longitude.toFixed(4) }}
          </div>
        </li>
      </ul>
      <div v-else>
        No sneezes logged yet
      </div>
      <button
        v-if="symptoms.length"
        @click="clearHistory"
      >
        Clear History
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSymptomTracker } from '../composables/useSymptomTracker';
import { useSneezePrediction } from '../composables/useSneezePrediction';
import { useNotifications } from '../composables/useNotifications';

const { symptoms, logSneeze, isGeolocationEnabled, clearSymptoms } = useSymptomTracker();
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

const clearHistory = () => {
  if (confirm('Are you sure you want to delete your sneeze history?')) {
    clearSymptoms();
  }
};
</script>
