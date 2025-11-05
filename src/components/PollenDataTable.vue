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
          <th
            v-for="pollenType in pollenTypes"
            :key="pollenType"
            class="p-3 text-start text-xs capitalize whitespace-nowrap"
          >
            {{ pollenType.replace(/_/g, " ").replace(/pollen/g, "pollen") }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-green-100">
        <tr
          v-for="record in records"
          :key="record.timestamp.toISOString()"
          class="hover:bg-gray-100"
        >
          <td class="p-3 whitespace-nowrap text-sm text-end">
            {{ new Date(record.timestamp).toLocaleString() }}
          </td>
          <td
            v-for="pollenType in pollenTypes"
            :key="pollenType"
            class="p-3 whitespace-nowrap text-sm text-left"
          >
            {{ record.levels[pollenType] }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text-center text-gray-500 mt-2">No data</div>
  </div>
</template>

<script setup lang="ts">
import type { PollenRecord } from "../interfaces/Pollen";

defineProps<{
  records: PollenRecord[];
  pollenTypes: string[];
}>();
</script>
