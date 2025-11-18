<template>
  <div class="my-3 overflow-x-auto rounded-xl">
    <table
      v-if="sortedRecords.length"
      class="table-auto min-w-full divide-y divide-green-100"
    >
      <thead class="bg-gray-100">
        <tr>
          <th
            v-for="key in columns"
            :key="key"
            class="p-3 text-start whitespace-nowrap text-xs capitalize"
            :class="{ active: sortKey == key }"
          >
            <button
              @click="sortBy(key)"
              class="w-full text-left bg-transparent cursor-pointer"
            >
              {{ key }}
              <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
              </span>
            </button>
          </th>
          <th v-if="onDelete" class="p-3 text-start whitespace-nowrap text-xs">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-green-100">
        <tr
          v-for="record in sortedRecords"
          :key="record.id"
          class="hover:bg-gray-100"
        >
          <td
            v-for="key in columns"
            :key="key"
            class="p-3 whitespace-nowrap text-sm"
          >
            {{ record[key] }}
          </td>
          <td v-if="onDelete" class="p-3 whitespace-nowrap text-sm">
            <button
              @click="onDelete(record)"
              class="cursor-pointer p-2 bg-transparent text-red-500 ring-2 rounded-lg hover:bg-red-500 hover:text-white"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text-center text-gray-500 mt-2">No data</div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import type { DataTableRow } from "../interfaces/DataTable";
import { useDataTableSorting } from "../composables/useDataTableSorting";

const props = defineProps<{
  records: DataTableRow[];
  columns: string[];
  onDelete?: (record: DataTableRow) => void;
}>();

const { records, columns } = toRefs(props);

const { sortKey, sortOrders, sortedRecords, sortBy } = useDataTableSorting(
  records,
  columns,
);
</script>

<style>
.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #222;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #222;
}
</style>
