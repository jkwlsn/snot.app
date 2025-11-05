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
import { useOpenMeteoAPI } from "../composables/useOpenMeteo";
import { formatDateForInput } from "../utils/formatDateForInput";
import { usefilterPollenDataByTimeframe } from "../utils/filterPollenLevelsByTimeframe";
import { parseLocalDatetimeToUTC } from "../utils/parseLocalDatetimeToUTC";
import { OPENMETEO_POLLEN_TYPES } from "../config";
import PollenDataTable from "./PollenDataTable.vue";
import type { Timeframe } from "../interfaces/Timeframe";
import type { PollenRecord } from "../interfaces/Pollen";

const { data } = useOpenMeteoAPI();
const filter = usefilterPollenDataByTimeframe();

const getStartOfCurrentHourLocal = (): string => {
  const now = new Date();
  now.setMinutes(0, 0, 0); // Set minutes, seconds, milliseconds to 0 in local time
  return formatDateForInput(now);
};

const minimumLocalDatetime = getStartOfCurrentHourLocal();
const startTime = ref<string>(minimumLocalDatetime);
const endTime = ref<string>("");

const filteredLevels = computed<PollenRecord[]>(() => {
  if (!data.value?.records) {
    return [];
  }

  const rawPollenData = data.value.records;

  const timeframe: Timeframe = {
    startTime: parseLocalDatetimeToUTC(startTime.value),
    endTime: parseLocalDatetimeToUTC(endTime.value),
  };

  return filter.filterPollenDataByTimeframe(rawPollenData, timeframe);
});
</script>
