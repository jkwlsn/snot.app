<template>
  <section
    class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-2 text-center">
      Recent Symptoms
    </h2>
    <div class="overflow-x-auto">
      <table
        v-if="symptoms.length"
        class="table-auto min-w-full divide-y divide-gray-200"
      >
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Time
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Symptom
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Severity
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Location
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="symptom in symptoms"
            :key="symptom.id"
            class="hover:bg-gray-100"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ new Date(symptom.time).toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ symptom.type }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ symptom.severity }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ symptom.location.latitude.toFixed(4) }},
              {{ symptom.location.longitude.toFixed(4) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <button
                @click="deleteSymptom(symptom.id)"
                class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-75 transition-colors duration-200"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center text-gray-500 mt-2 italic">
        No symptoms logged yet.
      </div>
    </div>
    <button
      v-if="symptoms.length"
      @click="clearHistory"
      class="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-75 transition-colors duration-200 mt-4"
    >
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
      'Are you sure you want to delete your symptom history? This action cannot be undone.',
    )
  ) {
    clearSymptoms();
  }
};
</script>
