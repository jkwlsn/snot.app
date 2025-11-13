<template>
  <DataTable :columns="columns" :records="transformedRecords" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SymptomRecord } from "../interfaces/SymptomRecord";
import DataTable from "./DataTable.vue";
import { formatDateToLocaleString } from "../utils/dateUtils";

const props = defineProps<{
  records: SymptomRecord[];
}>();

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
</script>
