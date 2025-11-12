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
        class="w-full cursor-pointer appearance-none bg-gradient-to-r from-yellow-200 to-red-500 rounded-lg"
      />
    </div>
    <div>
      <label>Pollen Types:</label>
      <div class="flex flex-row flex-wrap justify-center gap-2 my-4">
        <div v-for="pollenType in OPENMETEO_POLLEN_TYPES" :key="pollenType">
          <input
            type="checkbox"
            :id="pollenType"
            :value="pollenType"
            :checked="selectedPollenTypes.includes(pollenType)"
            @change="updateSelected"
            class="peer sr-only"
          />
          <label
            :for="pollenType"
            class="cursor-pointer inline-block p-2 rounded-lg ring-2 ring-purple-400 hover:bg-purple-400 hover:text-white peer-checked:text-white peer-checked:bg-purple-400 peer-checked:hover:bg-purple-500 peer-checked:hover:ring-purple-500"
          >
            {{ pollenType.replace("_pollen", "").replace("_", " ") }}
          </label>
        </div>
      </div>
      <div class="flex flex-row justify-center my-4">
        <button
          :disabled="
            selectedPollenTypes.length === OPENMETEO_POLLEN_TYPES.length
          "
          @click="selectAll"
          class="p-2 me-4 bg-purple-300 rounded-lg hover:bg-purple-500 hover:text-white hover:cursor-pointer"
        >
          Select all
        </button>
        <button
          :disabled="selectedPollenTypes.length === 0"
          @click="deselectAll"
          class="p-2 me-4 bg-purple-300 rounded-lg hover:bg-purple-500 hover:text-white hover:cursor-pointer"
        >
          Clear all
        </button>
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

const selectAll = (): void => {
  emit("update:selectedPollenTypes", [...OPENMETEO_POLLEN_TYPES]);
};

const deselectAll = (): void => {
  emit("update:selectedPollenTypes", []);
};

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
