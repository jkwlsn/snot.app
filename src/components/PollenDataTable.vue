<template>
  <DataTable :headers="headers" :records="transformedRecords" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PollenRecord } from "../interfaces/Pollen";
import type { DataTableRow } from "../interfaces/DataTable";
import DataTable from "./DataTable.vue";
import { formatDateToLocaleString } from "../utils/dateUtils";

const props = defineProps<{
  records: readonly PollenRecord[];
  pollenTypes: string[];
}>();

const headers = computed(() => [
  "Time",
  ...props.pollenTypes.map((pollenType) =>
    pollenType.replace(/_/g, " ").replace(/pollen/g, "pollen")
  ),
]);

const transformedRecords = computed(() =>
  props.records.map((record) => {
    const transformedRecord: DataTableRow = {
      Time: formatDateToLocaleString(record.timestamp, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    };
    for (const pollenType of props.pollenTypes) {
      transformedRecord[
        pollenType.replace(/_/g, " ").replace(/pollen/g, "pollen")
      ] = record.levels[pollenType];
    }
    return transformedRecord;
  })
);
</script>
