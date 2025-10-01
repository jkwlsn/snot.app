<template>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Type</th>
        <th>Timestamp</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="symptom in symptoms" :key="symptom.id">
        <td>{{ symptom.id }}</td>
        <td>{{ symptom.type }}</td>
        <td>{{ new Date(symptom.timestamp).toLocaleString() }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { db } from "../db";
import { liveQuery } from "dexie";
import { type Symptom } from "../interfaces/symptom";

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
