<template>
  <form @submit.prevent>
    <fieldset>
      <div v-if="noLocation">Set location to log symptoms</div>
      <div v-else>
        <label>Select symptoms:</label>
        <div v-for="symptom in symptomObjects" :key="symptom.id">
          <input
            :id="`symptom-${symptom.id}`"
            v-model="selectedSymptoms"
            :value="symptom.name"
            type="checkbox"
          />
          <label :for="`symptom-${symptom.id}`">
            {{ symptom.name }}
          </label>
        </div>
        <button :disabled="selectedSymptoms.length === 0" @click="clearForm">
          Clear all
        </button>
        <button :disabled="selectedSymptoms.length === 0" @click="logSymptoms">
          Log Symptom
        </button>
      </div>
    </fieldset>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { SYMPTOM_LIST } from "../config";
import { db } from "../db";
import { useGeolocation } from "../composables/useGeolocation";

const geolocation = useGeolocation();

const selectedSymptoms = ref([]);

const noLocation = computed(() => geolocation.location.value === null);

const symptomObjects = SYMPTOM_LIST.map((symptom: string, index: number) => ({
  id: index,
  name: symptom,
}));

const clearForm = () => {
  selectedSymptoms.value = [];
};

const addSymptom = async (symptom: string) => {
  try {
    const id = await db.symptoms.add({
      type: symptom,
      timestamp: Date.now(),
      location: {
        latitude: geolocation.location.value.latitude,
        longitude: geolocation.location.value.longitude,
      },
    });
    console.log("logged:", symptom, "with id:", id);
  } catch (error) {
    console.error("Failed to add symptom:", error);
  }
};

const logSymptoms = async () => {
  try {
    await Promise.all(selectedSymptoms.value.map(addSymptom));
    clearForm();
  } catch (error) {
    console.error(error);
  }
};
</script>
