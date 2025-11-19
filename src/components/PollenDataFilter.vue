<template>
  <form>
    <fieldset class="flex flex-col gap-2 sm:flex-row justify-center">
      <div
        class="flex flex-col p-2 rounded-xl sm:rounded-s-xl sm:rounded-e-none bg-white"
      >
        <label for="startTimeInput" class="text-xs font-bold">From:</label>
        <input
          type="datetime-local"
          id="startTimeInput"
          v-model="startTime"
          :min="minimumLocalDatetime"
          step="3600"
          class="hover:cursor-pointer"
        />
      </div>
      <div
        class="flex flex-col p-2 rounded-xl sm:rounded-s-none sm:rounded-e-xl bg-white"
      >
        <label for="endTimeInput" class="text-xs font-bold">To:</label>
        <input
          type="datetime-local"
          id="endTimeInput"
          v-model="endTime"
          :min="startTime"
          step="3600"
          class="hover:cursor-pointer"
        />
      </div>
    </fieldset>
  </form>
  <PollenDataTable
    :records="filteredLevels"
    :pollen-types="OPENMETEO_POLLEN_TYPES"
  />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { startOfHour, endOfHour } from "date-fns";
import { useOpenMeteoAPI } from "../composables/useOpenMeteo";
import { filterPollenDataByTimeframe } from "../utils/filterPollenLevelsByTimeframe";
import { OPENMETEO_POLLEN_TYPES } from "../config";
import PollenDataTable from "./PollenDataTable.vue";
import type { Timeframe } from "../interfaces/Timeframe";
import type { PollenRecord } from "../interfaces/Pollen";
import { createUTCDate, formatDateForInput, parseDateFromInput } from "../utils/dateUtils";

const { data } = useOpenMeteoAPI();

const getStartOfCurrentHourLocal = (): string => {
  const now = createUTCDate();
  return formatDateForInput(startOfHour(now));
};

const minimumLocalDatetime = getStartOfCurrentHourLocal();
const startTime = ref<string>(minimumLocalDatetime);
const endTime = ref<string>(formatDateForInput(createUTCDate()));

const filteredLevels = computed<PollenRecord[]>(() => {
  if (!data.value?.records) {
    return [];
  }

  const rawPollenData = data.value.records;

  const timeframe: Timeframe = {
    startTime: parseDateFromInput(startTime.value),
    endTime: endOfHour(parseDateFromInput(endTime.value)),
  };

  return filterPollenDataByTimeframe(rawPollenData, timeframe);
});
</script>
