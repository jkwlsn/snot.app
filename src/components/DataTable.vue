<template>
  <div class="my-3 overflow-x-auto rounded-xl">
    <table
      v-if="records.length"
      class="table-auto min-w-full divide-y divide-green-100"
    >
      <thead class="bg-gray-100">
        <tr>
          <th
            v-for="header in headers"
            :key="header"
            class="p-3 text-start whitespace-nowrap text-xs capitalize"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-green-100">
        <tr
          v-for="(record, index) in records"
          :key="index"
          class="hover:bg-gray-100"
        >
          <td
            v-for="header in headers"
            :key="header"
            class="p-3 whitespace-nowrap text-sm"
          >
            {{ record[header] }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text-center text-gray-500 mt-2">No data</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  records: Record<string, any>[];
  headers: string[];
}>();
</script>
