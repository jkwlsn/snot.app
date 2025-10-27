import { computed, type Ref } from "vue";
import type { ChartData, ChartOptions } from "chart.js";
import type { SymptomRecord } from "../interfaces/SymptomRecord";
import { useDoughnutChart } from "./useDoughnutChart";

function getSymptomTypeCounts(symptoms: SymptomRecord[]): Map<string, number> {
  const symptomTypeCounts = new Map<string, number>();

  for (const symptom of symptoms) {
    symptomTypeCounts.set(
      symptom.type,
      (symptomTypeCounts.get(symptom.type) ?? 0) + 1,
    );
  }

  return symptomTypeCounts;
}

export function useSymptomsPerTotalChart(symptoms: Ref<SymptomRecord[]>): {
  data: Ref<ChartData<"doughnut">>;
  options: Ref<ChartOptions<"doughnut">>;
} {
  const symptomTypeCounts = computed(() =>
    getSymptomTypeCounts(symptoms.value),
  );
  return useDoughnutChart(symptomTypeCounts);
}
