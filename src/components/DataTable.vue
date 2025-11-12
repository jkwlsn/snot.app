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
            class="p-3 text-start whitespace-nowrap text-xs capitalize cursor-pointer"
            @click="sortBy(key)"
            :class="{ active: sortKey == key }"
          >
            {{ key }}
            <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
            </span>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-green-100">
        <tr
          v-for="(record, index) in sortedRecords"
          :key="index"
          class="hover:bg-gray-100"
        >
          <td
            v-for="key in columns"
            :key="key"
            class="p-3 whitespace-nowrap text-sm"
          >
            {{ record[key] }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text-center text-gray-500 mt-2">No data</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { DataTableRow } from "../interfaces/DataTable";

const props = defineProps<{
  records: DataTableRow[];
  columns: string[];
}>();

const sortKey = ref("");
const sortOrders = ref(
  props.columns.reduce((o, key) => ({ ...o, [key]: 1 }), {})
);

const sortedRecords = computed(() => {
  const key = sortKey.value;
  if (!key) {
    return props.records;
  }
  const order = sortOrders.value[key];
  return [...props.records].sort((a, b) => {
    let valA = a[key];
    let valB = b[key];

    // Handle null values: nulls go to the end
    if (valA === null && valB === null) return 0;
    if (valA === null) return order; // If A is null, B comes first (or A last if order is 1)
    if (valB === null) return -order; // If B is null, A comes first (or B last if order is 1)

    // Case-insensitive string comparison
    if (typeof valA === "string" && typeof valB === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA === valB) {
      return 0;
    }
    return (valA > valB ? 1 : -1) * order;
  });
});

function sortBy(key: string) {
  sortKey.value = key;
  sortOrders.value[key] *= -1;
}
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
