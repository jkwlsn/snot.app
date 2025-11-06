<template>
  <DataTable :headers="headers" :records="transformedRecords" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SymptomRecord } from "../interfaces/SymptomRecord";
import DataTable from "./DataTable.vue";
import { formatDateToLocaleString } from "../utils/dateUtils";

const props = defineProps<{
  records: SymptomRecord[];
}>();

const headers = ["Time", "Symptom", "Severity"];

const transformedRecords = computed(() =>
  props.records.map((record) => ({
    Time: formatDateToLocaleString(record.timestamp),
    Symptom: record.type,
    Severity: record.severity,
  }))
);
</script>
