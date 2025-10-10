<template>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Type</th>
        <th>Timestamp</th>
        <th>Latitude</th>
        <th>Longitude</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="symptom in symptoms" :key="symptom.id">
        <td>{{ symptom.id }}</td>
        <td>{{ symptom.type }}</td>
        <td>{{ new Date(symptom.timestamp).toLocaleString() }}</td>
        <td>{{ symptom.location.latitude }}</td>
        <td>{{ symptom.location.longitude }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { db } from "../db";
import { liveQuery } from "dexie";
import { Symptom } from "../interfaces/symptom";

const symptoms = ref<Symptom[]>([]);

let liveSubscription: { unsubscribe: () => void } | null = null;

const subscribeToLiveQuery = () => {
  liveSubscription = liveQuery(() => db.symptoms.toArray()).subscribe(
    (updatedSymptoms: Symptom[]) => {
      symptoms.value = updatedSymptoms;
    },
  );
};

onMounted(() => {
  subscribeToLiveQuery();
});

onBeforeUnmount(() => {
  if (liveSubscription) {
    liveSubscription.unsubscribe();
  }
});
</script>
