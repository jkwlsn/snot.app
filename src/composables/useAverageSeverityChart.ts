import { type Ref } from "vue";
import type { ChartOptions } from "chart.js";
import type { SymptomRecord } from "../interfaces/SymptomRecord";
import { useDailyBarChart } from "./useDailyBarChart";

export function useAverageSeverityChart(
  symptomsGroupedByDay: Ref<Map<string, SymptomRecord[]>>,
) {
  const data = useDailyBarChart(
    symptomsGroupedByDay,
    (symptomsForDay) => {
      const totalSeverity = symptomsForDay.reduce(
        (sum, symptom) => sum + symptom.severity,
        0,
      );
      return totalSeverity / symptomsForDay.length;
    },
    "Average Severity",
    "#FFFF66",
  );

  const options: ChartOptions<"bar"> = {
    responsive: true,
    animation: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        type: "time",
        time: {
          unit: "day",
        },
      },
    },
  };

  return { data, options };
}
