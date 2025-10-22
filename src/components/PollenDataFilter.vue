<template>
  <section>
    <h2>Filter Pollen Data</h2>
    <form>
      <fieldset>
        <div>
          <label for="startTimeInput">Start</label>
          <input
            type="datetime-local"
            id="startTimeInput"
            v-model="startTime"
            :min="minimumLocalDatetime"
            step="3600"
          />
        </div>
        <div>
          <label for="endTimeInput">End</label>
          <input
            type="datetime-local"
            id="endTimeInput"
            v-model="endTime"
            :min="startTime"
            step="3600"
          />
        </div>
      </fieldset>
    </form>
    <pre>{{ JSON.stringify(filteredLevels, null, 2) }}</pre>
  </section>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useOpenMeteoAPI } from "../composables/useOpenMeteo";
import {
  RawPollenData,
  usefilterPollenDataByTimeframe,
} from "../utils/filterPollenLevelsByTimeframe";
import { Timeframe } from "../interfaces/Timeframe";
import { formatDateForInput } from "../utils/formatDateForInput";
import { parseLocalDatetimeToUTC } from "../utils/parseLocalDatetimeToUTC";

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

const filteredLevels = computed(() => {
  if (!data.value?.hourly) {
    return [];
  }
  const rawPollenData = data.value?.hourly as unknown as RawPollenData;

  const timeframe: Timeframe = {
    startTime: parseLocalDatetimeToUTC(startTime.value),
    endTime: parseLocalDatetimeToUTC(endTime.value),
  };

  return filter.filterPollenDataByTimeframe(rawPollenData, timeframe);
});
</script>
