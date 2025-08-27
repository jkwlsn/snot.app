<template>
  <section>
    <h3>Recent Sneezes</h3>
    <table v-if="symptoms.length">
      <thead>
        <tr>
          <th scope="col">
            Time
          </th>
          <th scope="col">
            Severity
          </th>
          <th scope="col">
            Location
          </th>
          <th scope="col">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="symptom in symptoms" :key="symptom.id">
          <td>
            {{ new Date(symptom.time).toLocaleString() }}
          </td>
          <td>
            {{ symptom.severity }}
          </td>
          <td>
            {{ symptom.location.latitude.toFixed(4) }},
            {{ symptom.location.longitude.toFixed(4) }}
          </td>
          <td>
            <button @click="deleteSymptom(symptom.id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      No sneezes logged yet.
    </div>
    <button v-if="symptoms.length" @click="clearHistory">
      Clear History
    </button>
  </section>
</template>

<script setup>
import { useSymptomTracker } from '../composables/useSymptomTracker';

const { symptoms, deleteSymptom, clearSymptoms } = useSymptomTracker();

const clearHistory = () => {
  if (
    confirm(
      'Are you sure you want to delete your sneeze history? This action cannot be undone.',
    )
  ) {
    clearSymptoms();
  }
};
</script>
