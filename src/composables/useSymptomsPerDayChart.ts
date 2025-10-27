import type { Ref } from "vue";
import type { ChartOptions } from "chart.js";
import type { SymptomRecord } from "../interfaces/SymptomRecord";
import { useDailyBarChart } from "./useDailyBarChart";

export function useSymptomsPerDayChart(
  symptomsGroupedByDay: Ref<Map<string, SymptomRecord[]>>,
) {
  const data = useDailyBarChart(
    symptomsGroupedByDay,
    (symptomsForDay) => symptomsForDay.length,
    "Symptoms per day",
    "lightgreen",
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
