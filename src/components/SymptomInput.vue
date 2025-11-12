<template>
  <p v-if="noLocation">Set location to log symptoms</p>
  <form v-else @submit.prevent>
    <fieldset>
      <legend>Select symptoms:</legend>
      <div class="flex flex-row flex-wrap justify-center gap-2 mb-4">
        <div v-for="symptom in symptomObjects" :key="symptom.id">
          <input
            :id="`symptom-${symptom.id}`"
            v-model="selectedSymptoms"
            :value="symptom.name"
            type="checkbox"
            class="peer sr-only"
          />
          <label
            :for="`symptom-${symptom.id}`"
            class="cursor-pointer inline-block p-2 rounded-lg ring-2 ring-purple-400 hover:bg-purple-400 hover:text-white peer-checked:text-white peer-checked:bg-purple-400 peer-checked:hover:bg-purple-500 peer-checked:hover:ring-purple-500"
          >
            {{ symptom.name }}
          </label>
        </div>
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
          class="w-full cursor-pointer appearance-none bg-gradient-to-r from-yellow-200 to-red-500 rounded-lg"
        />
      </div>
      <div class="flex flex-row justify-center my-4">
        <button
          :disabled="selectedSymptoms.length === symptomObjects.length"
          @click="selectAll"
          class="p-2 me-4 bg-purple-300 rounded-lg hover:bg-purple-500 hover:text-white hover:cursor-pointer"
        >
          Select all
        </button>
        <button
          :disabled="selectedSymptoms.length === 0"
          @click="deselectAll"
          class="p-2 me-4 bg-purple-300 rounded-lg hover:bg-purple-500 hover:text-white hover:cursor-pointer"
        >
          Clear all
        </button>
        <button
          :disabled="selectedSymptoms.length === 0"
          @click="logSymptoms"
          class="p-2 me-4 bg-purple-300 rounded-lg hover:bg-purple-500 hover:text-white hover:cursor-pointer"
        >
          Log Symptom
        </button>
      </div>
    </fieldset>
  </form>
</template>

<script setup lang="ts">
import { useSymptomInput } from "../composables/useSymptomInput";

const symptomSeverity = defineModel<number>({ default: 1 });

const {
  noLocation,
  selectedSymptoms,
  symptomObjects,
  deselectAll,
  selectAll,
  logSymptoms,
} = useSymptomInput(symptomSeverity);
</script>
