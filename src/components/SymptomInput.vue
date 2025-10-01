<template>
  <form @submit.prevent>
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
      <button :disabled="selectedSymptoms.length === 0" @click="clearForm">
        Clear all
      </button>
      <button :disabled="selectedSymptoms.length === 0" @click="logSymptoms">
        Log Symptom
      </button>
    </fieldset>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { SYMPTOM_LIST } from "../config";
import { db } from "../db";

let selectedSymptoms = ref([]);

// Give the symptoms list a name and an ID
const symptomObjects = SYMPTOM_LIST.map((symptom, index) => ({
  id: index, // You can also use something like a UUID here for a unique id
  name: symptom,
}));

const clearForm = () => {
  selectedSymptoms.value = [];
};

const addSymptom = async (symptom) => {
  try {
    const id = await db.symptoms.add({
      type: symptom,
      timestamp: Date.now(),
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
