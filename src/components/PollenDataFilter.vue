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
            :min="minimumDateTime"
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

const { data } = useOpenMeteoAPI();
const filter = usefilterPollenDataByTimeframe();

const minimumDateTime = new Date().toISOString().split(":")[0] + ":00";
const startTime = ref<string>(minimumDateTime);
const endTime = ref<string>("");

const filteredLevels = computed(() => {
  if (!data.value?.hourly) {
    return [];
  }

  return filter.filterPollenDataByTimeframe(
    data.value.hourly as unknown as RawPollenData,
    startTime.value,
    endTime.value,
  );
});
</script>
