<template>
  <DataTable
    :columns="columns"
    :records="transformedRecords"
    :on-delete="handleDelete"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SymptomRecord } from "../interfaces/SymptomRecord";
import DataTable from "./DataTable.vue";
import { formatDateToLocaleString } from "../utils/dateUtils";
import { useSymptoms } from "../composables/useSymptoms";
import type { DataTableRow } from "../interfaces/DataTable";

const props = defineProps<{
  records: SymptomRecord[];
}>();

const { deleteSymptom } = useSymptoms();

const columns = ["Time", "Symptom", "Severity"];

const transformedRecords = computed(() =>
  props.records.map((record) => ({
    id: record.id,
    Time: formatDateToLocaleString(record.timestamp, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    Symptom: record.type,
    Severity: record.severity,
  })),
);

function handleDelete(record: DataTableRow) {
  if (record.id) {
    deleteSymptom(Number(record.id));
  }
}
</script>
