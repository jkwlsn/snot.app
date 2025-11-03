<template>
    <p v-if="noLocation">Set location to log symptoms</p>
    <form v-else @submit.prevent>
      <fieldset>
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
        <div>
          <label for="severity"
            >Severity: <output>{{ symptomSeverity }}</output></label
          >
          <input
            type="range"
            id="severity"
            name="severity"
            min="1"
            max="5"
            v-model.number="symptomSeverity"
            step="1"
          />
        </div>
        <button :disabled="selectedSymptoms.length === 0" @click="clearForm">
          Clear all
        </button>
        <button :disabled="selectedSymptoms.length === 0" @click="logSymptoms">
          Log Symptom
        </button>
      </fieldset>
    </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { SYMPTOM_LIST } from "../config";
import { db } from "../db";
import { useGeolocation } from "../composables/useGeolocation";
import { useOpenMeteoAPI } from "../composables/useOpenMeteo";
import { usefilterPollenDataByTimeframe } from "../utils/filterPollenLevelsByTimeframe";
import { createTimeframe } from "../utils/createTimeframe";
import type { Coordinates } from "../interfaces/Coordinates";
import type { SymptomRecord } from "../interfaces/SymptomRecord";
import type { PollenRecord } from "../interfaces/Pollen";

const { data: openMeteoApiData, openMeteoFetch } = useOpenMeteoAPI();
const apiData = computed(() => openMeteoApiData.value);
const filter = usefilterPollenDataByTimeframe();

const geolocation = useGeolocation();

const location = computed<Coordinates | null>(() => geolocation.location.value);

const selectedSymptoms = ref<string[]>([]);

const symptomSeverity = defineModel<number>({ default: 1 });

const noLocation = computed(() => geolocation.location.value === null);

const symptomObjects = SYMPTOM_LIST.map((symptom: string, index: number) => ({
  id: index,
  name: symptom,
}));

const clearForm = (): void => {
  selectedSymptoms.value = [];
  symptomSeverity.value = 1;
};

const createSymptomRecord = (symptom: string): SymptomRecord | null => {
  try {
    if (location.value === null) {
      throw new Error("No location set");
    }
    if (apiData.value === null) {
      throw new Error("No pollen data");
    }

    const currentTime = new Date();

    const currentTimeframe = createTimeframe(currentTime);

    const currentPollenData = filter.filterPollenDataByTimeframe(
      apiData.value.records,
      currentTimeframe,
    );

    return {
      type: symptom,
      severity: symptomSeverity.value,
      timestamp: currentTime,
      location: JSON.parse(
        JSON.stringify({
          latitude: location.value.latitude,
          longitude: location.value.longitude,
        }),
      ) as Coordinates,
      pollenData: JSON.parse(
        JSON.stringify(currentPollenData),
      ) as PollenRecord[],
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("createSymptomRecord failed:", error.message);
    } else {
      const unknownErrorString = String(error);
      console.error(
        "createSymptomRecord failed: An unknown error occurred.",
        unknownErrorString,
      );
    }
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("addSymptom failed:", error.message);
    } else {
      const unknownErrorString = String(error);
      console.error(
        "addSymptom failed: An unknown error occurred.",
        unknownErrorString,
      );
    }
  }
};

const logSymptoms = async (): Promise<void> => {
  try {
    await Promise.all(selectedSymptoms.value.map(addSymptom));
    clearForm();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("logSymptoms failed:", error.message);
    } else {
      const unknownErrorString = String(error);
      console.error(
        "logSymptoms failed: An unknown error occurred.",
        unknownErrorString,
      );
    }
  }
};

watch(
  location,
  (newLocation) => {
    if (newLocation) {
      void openMeteoFetch({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
      });
    }
  },
  { immediate: true },
);
</script>
