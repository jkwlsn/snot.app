import { computed, type Ref } from "vue";
import type { ChartData, ChartDataset } from "chart.js";
import type { SymptomRecord } from "../interfaces/SymptomRecord";
import { parseISO, getUnixTime } from "date-fns";

// This composable transforms the grouped data into ChartData format
export function useDailyBarChart(
  symptomsGroupedByDay: Ref<Map<string, SymptomRecord[]>>,
  valueExtractor: (symptomsForDay: SymptomRecord[]) => number,
  label: string,
  backgroundColor: string,
): Ref<ChartData<"bar", { x: number; y: number }[]>> {
  // Change x type to number
  const chartData = computed<ChartData<"bar", { x: number; y: number }[]>>(
    () => {
      // Change x type to number
      const dataPoints = Array.from(symptomsGroupedByDay.value.entries()).map(
        ([dateString, symptomsForDay]) => ({
          x: parseISO(dateString).getTime(), // Convert to Unix timestamp (milliseconds)
          y: valueExtractor(symptomsForDay),
        }),
      );

      return {
        datasets: [
          {
            label: label,
            data: dataPoints,
            backgroundColor: backgroundColor,
          } as ChartDataset<"bar", { x: number; y: number }[]>,
        ],
      };
    },
  );

  return chartData;
}
