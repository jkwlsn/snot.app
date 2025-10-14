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
import { Coordinates } from "../interfaces/coordinates";
import { SymptomRecord } from "../interfaces/SymptomRecord";

const geolocation = useGeolocation();
const location = computed<Coordinates | null>(() => geolocation.location.value);

const selectedSymptoms = ref<string[]>([]);

const noLocation = computed(() => geolocation.location.value === null);

const symptomObjects = SYMPTOM_LIST.map((symptom: string, index: number) => ({
  id: index,
  name: symptom,
}));

const clearForm = () => {
  selectedSymptoms.value = [];
};

const createSymptomRecord = (symptom: string): SymptomRecord | null => {
  try {
    if (location.value === null) {
      throw new Error("No location set");
    }
    return {
      type: symptom,
      timestamp: new Date(),
      location: {
        latitude: location.value.latitude,
        longitude: location.value.longitude,
      },
    };
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

const addSymptom = async (symptom: string): Promise<void> => {
  try {
    if (geolocation.location.value === null) {
      throw new Error("No location set");
    }

    const newSymptomRecord = createSymptomRecord(symptom);

    if (newSymptomRecord === null) return;

    await db.symptoms.add(newSymptomRecord);
  } catch (error: any) {
    console.error("Failed to add symptom:", error);
  }
};

const logSymptoms = async () => {
  try {
    await Promise.all(selectedSymptoms.value.map(addSymptom));
    clearForm();
  } catch (error: any) {
    console.error(error);
  }
};
</script>
