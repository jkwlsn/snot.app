<script setup>
import { ref } from 'vue'; // Import ref for new input
import GeoLocation from '../components/GeoLocation.vue';
import PollenSelector from '../components/PollenSelector.vue';
import { settings } from '../composables/useUserSettings'; // Import settings directly
import { POLLEN_DISPLAY_NAMES } from '../pollen'; // Import all pollen types

// settings is now directly imported

const newSymptomName = ref(''); // Reactive variable for new symptom input

const addCustomSymptom = () => {
  if (newSymptomName.value.trim() !== '') {
    const newSymptom = {
      id: newSymptomName.value.trim().toLowerCase().replace(/\s+/g, '_'), // Simple ID generation
      name: newSymptomName.value.trim(),
    };
    // Ensure custom_symptoms array exists
    if (!settings.value.custom_symptoms) {
      settings.value.custom_symptoms = [];
    }
    settings.value.custom_symptoms.push(newSymptom);
    newSymptomName.value = ''; // Clear input
  }
};

const removeCustomSymptom = (idToRemove) => {
  settings.value.custom_symptoms = settings.value.custom_symptoms.filter(
    (symptom) => symptom.id !== idToRemove,
  );
};

// Handlers for confirmed_allergies and ignored_pollens
const togglePollenInSetting = (pollenType, settingKey) => {
  const index = settings.value[settingKey].indexOf(pollenType);
  if (index > -1) {
    settings.value[settingKey].splice(index, 1);
  } else {
    settings.value[settingKey].push(pollenType);
  }
};

const isPollenInSetting = (pollenType, settingKey) => {
  return settings.value[settingKey].includes(pollenType);
};
</script>

<template>
  <div>
    <GeoLocation />
    <PollenSelector />

    <section
      class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg"
    >
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">
        Custom Symptom Tracking
      </h2>
      <div class="mb-4">
        <input
          type="text"
          v-model="newSymptomName"
          placeholder="e.g., Itchy Eyes, Runny Nose"
          class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          @keyup.enter="addCustomSymptom"
        />
        <button
          @click="addCustomSymptom"
          class="mt-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-75 transition-colors duration-200"
        >
          Add Custom Symptom
        </button>
      </div>

      <div v-if="settings.custom_symptoms && settings.custom_symptoms.length > 0">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Your Custom Symptoms:</h3>
        <ul>
          <li
            v-for="symptom in settings.custom_symptoms"
            :key="symptom.id"
            class="flex justify-between items-center bg-white p-3 rounded-md shadow-sm mb-2"
          >
            <span>{{ symptom.name }}</span>
            <button
              @click="removeCustomSymptom(symptom.id)"
              class="text-red-500 hover:text-red-700 font-semibold py-1 px-2 rounded-md transition-colors duration-200"
            >
              Remove
            </button>
          </li>
        </ul>
      </div>
      <p v-else class="text-center text-gray-500 italic">No custom symptoms added yet.</p>
    </section>

    <section
      class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg"
    >
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">
        Allergy Management
      </h2>
      <h3 class="text-lg font-semibold text-gray-700 mb-2">Confirmed Allergies:</h3>
      <div class="flex flex-wrap gap-2 mb-4">
        <div v-for="pollenType in Object.keys(POLLEN_DISPLAY_NAMES)" :key="pollenType" class="flex items-center">
          <input
            type="checkbox"
            :id="`confirmed-${pollenType}`"
            :checked="isPollenInSetting(pollenType, 'confirmed_allergies')"
            @change="togglePollenInSetting(pollenType, 'confirmed_allergies')"
            class="mr-1 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
          />
          <label :for="`confirmed-${pollenType}`" class="text-gray-700 text-sm">
            {{ POLLEN_DISPLAY_NAMES[pollenType] }}
          </label>
        </div>
      </div>

      <h3 class="text-lg font-semibold text-gray-700 mb-2">Ignored Pollens:</h3>
      <div class="flex flex-wrap gap-2">
        <div v-for="pollenType in Object.keys(POLLEN_DISPLAY_NAMES)" :key="pollenType" class="flex items-center">
          <input
            type="checkbox"
            :id="`ignored-${pollenType}`"
            :checked="isPollenInSetting(pollenType, 'ignored_pollens')"
            @change="togglePollenInSetting(pollenType, 'ignored_pollens')"
            class="mr-1 h-4 w-4 text-red-500 focus:ring-red-400 border-gray-300 rounded"
          />
          <label :for="`ignored-${pollenType}`" class="text-gray-700 text-sm">
            {{ POLLEN_DISPLAY_NAMES[pollenType] }}
          </label>
        </div>
      </div>
    </section>
  </div>
</template>
