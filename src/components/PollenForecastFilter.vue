<template>
  <fieldset>
    <legend>Filters</legend>
    <div>
      <label for="minLevel">Minimum Pollen Level: {{ minLevel }}</label>
      <input
        type="range"
        id="minLevel"
        :value="minLevel"
        @input="
          emit(
            'update:minLevel',
            parseInt(($event.target as HTMLInputElement).value),
          )
        "
        min="0"
        :max="maxPollenLevel + 1"
      />
    </div>
    <div>
      <label>Pollen Types:</label>
      <div v-for="pollenType in OPENMETEO_POLLEN_TYPES" :key="pollenType">
        <input
          type="checkbox"
          :id="pollenType"
          :value="pollenType"
          :checked="selectedPollenTypes.includes(pollenType)"
          @change="updateSelected"
        />
        <label :for="pollenType">{{
          pollenType.replace("_pollen", "").replace("_", " ")
        }}</label>
      </div>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { OPENMETEO_POLLEN_TYPES } from "../config";
import type { PollenType } from "../interfaces/PollenTypes";

const props = defineProps<{
  minLevel: number;
  selectedPollenTypes: PollenType[];
  maxPollenLevel: number;
}>();

const emit = defineEmits<{
  (e: "update:minLevel", value: number): void;
  (e: "update:selectedPollenTypes", value: PollenType[]): void;
}>();

const updateSelected = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const pollenType = target.value;

  if (target.checked) {
    emit("update:selectedPollenTypes", [
      ...props.selectedPollenTypes,
      pollenType,
    ]);
  } else {
    emit(
      "update:selectedPollenTypes",
      props.selectedPollenTypes.filter((type) => type !== pollenType),
    );
  }
};
</script>
