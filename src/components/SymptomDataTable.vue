<template>
  <div class="py-3 overflow-x-auto">
    <table
      v-if="records.length"
      class="table-auto min-w-full divide-y divide-green-100"
    >
      <thead class="bg-gray-100">
        <tr>
          <th class="p-3 text-start whitespace-nowrap text-xs capitalize">
            Time
          </th>
          <th class="p-3 text-start whitespace-nowrap text-xs capitalize">
            Symptom
          </th>
          <th class="p-3 text-start whitespace-nowrap text-xs capitalize">
            Severity
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-green-100">
        <tr
          v-for="record in records"
          :key="record.id"
          class="hover:bg-gray-100"
        >
          <td class="p-3 text-start whitespace-nowrap text-sm">
            {{ new Date(record.timestamp).toLocaleString() }}
          </td>
          <td class="p-3 text-start whitespace-nowrap text-sm">
            {{ record.type }}
          </td>
          <td class="p-3 text-start whitespace-nowrap text-sm">
            {{ record.severity }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text-center text-gray-500 mt-2">No data</div>
  </div>
</template>

<script setup lang="ts">
import type { SymptomRecord } from "../interfaces/SymptomRecord";

defineProps<{
  records: SymptomRecord[];
}>();
</script>
