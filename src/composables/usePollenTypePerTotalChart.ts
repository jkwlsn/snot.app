import { computed, type Ref } from "vue";
import type { ChartData, ChartOptions } from "chart.js";
import type { SymptomRecord } from "../interfaces/SymptomRecord";
import type { PollenType } from "../interfaces/PollenTypes";
import { useDoughnutChart } from "./useDoughnutChart";

function getPollenTypeCounts(
  symptoms: SymptomRecord[],
): Map<PollenType, number> {
  if (!Array.isArray(symptoms)) {
    return new Map();
  }

  return symptoms.reduce((counts, symptom) => {
    symptom.pollenData.forEach((record) => {
      for (const pollenType in record.levels) {
        if (
          record.levels[pollenType] !== null &&
          record.levels[pollenType] > 0
        ) {
          const type = pollenType;
          counts.set(type, (counts.get(type) ?? 0) + 1);
        }
      }
    });
    return counts;
  }, new Map<PollenType, number>());
}

export function usePollenTypePerTotalChart(symptoms: Ref<SymptomRecord[]>): {
  data: Ref<ChartData<"doughnut">>;
  options: Ref<ChartOptions<"doughnut">>;
} {
  const pollenTypeCounts = computed(() => getPollenTypeCounts(symptoms.value));
  return useDoughnutChart(pollenTypeCounts);
}
