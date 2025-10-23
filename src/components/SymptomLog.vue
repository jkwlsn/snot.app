<template>
  <pre> {{ symptoms }} </pre>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { db } from "../db";
import { liveQuery } from "dexie";
import { SymptomRecord } from "../interfaces/SymptomRecord";

const symptoms = ref<SymptomRecord[]>([]);

let liveSubscription: { unsubscribe: () => void } | null = null;

const subscribeToLiveQuery = () => {
  liveSubscription = liveQuery(() => db.symptoms.toArray()).subscribe(
    (updatedSymptoms: SymptomRecord[]) => {
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
