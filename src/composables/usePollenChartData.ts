import { computed, type Ref } from "vue";
import { OPENMETEO_POLLEN_TYPES } from "../config";
import { useOpenMeteoAPI } from "./useOpenMeteo";
import {
  filterPollenByLevel,
  filterPollenByType,
} from "../composables/usePollenFilters";
import { chartColors } from "../utils/chartColors";
import type { ChartData, ChartDataset, ChartOptions } from "chart.js";
import type { PollenType } from "../interfaces/PollenTypes";
import type { PollenRecord } from "../interfaces/Pollen";

export function usePollenChartData(minLevel: Ref<number>, selectedPollenTypes: Ref<PollenType[]>): {
  chartData: Ref<ChartData<"line">>;
  chartOptions: Ref<ChartOptions<"line">>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  maxPollenLevel: Ref<number>;
} {
  const { data: rawPollenData, loading, error } = useOpenMeteoAPI();

  const maxPollenLevel = computed<number>(() => {
    if (!rawPollenData.value) {
      return 0;
    }
    let maxLevel = 0;
    rawPollenData.value.records.forEach((record: PollenRecord) => {
      OPENMETEO_POLLEN_TYPES.forEach((pollenType) => {
        const level = record.levels[pollenType];
        if (typeof level === "number" && level > maxLevel) {
          maxLevel = level;
        }
      });
    });
    return maxLevel;
  });

  const chartData = computed<ChartData<"line">>(() => {
    const currentRawPollenData = rawPollenData.value;
    if (!currentRawPollenData) {
      return { datasets: [] };
    }

    let filteredPollenData = currentRawPollenData;

    if (minLevel.value > 0) {
      filteredPollenData = filterPollenByLevel(
        filteredPollenData,
        minLevel.value,
      );
    }

    if (selectedPollenTypes.value.length > 0) {
      filteredPollenData = filterPollenByType(
        filteredPollenData,
        selectedPollenTypes.value,
      );
    }

    const datasets: ChartDataset<"line">[] = [];

    OPENMETEO_POLLEN_TYPES.forEach((pollenType, index) => {
      const dataPoints: { x: number; y: number }[] = [];

      filteredPollenData.records.forEach((record: PollenRecord) => {
        const level = record.levels[pollenType];
        if (level !== null) {
          const timestamp = record.timestamp.getTime();
          dataPoints.push({ x: timestamp, y: level });
        }
      });

      if (dataPoints.length > 0) {
        const color = chartColors[index % chartColors.length];
        datasets.push({
          label: pollenType.replace("_pollen", "").replace("_", " "),
          data: dataPoints,
          fill: false,
          tension: 0,
          pointRadius: 3,
          pointHoverRadius: 5,
          backgroundColor: color,
          borderColor: color,
        });
      }
    });

    return {
      datasets: datasets,
    };
  });

  const chartOptions = computed<ChartOptions<"line">>(() => {
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: "Pollen Forecast",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        x: {
          type: "time",
          ticks: {
            callback: function (value, _index, _ticks): string {
              const date = new Date(value);
              if (date.getHours() === 0) {
                return new Intl.DateTimeFormat(undefined, {
                  month: "short",
                  day: "numeric",
                }).format(date);
              }
              return new Intl.DateTimeFormat(undefined, {
                hour: "numeric",
                minute: "2-digit",
              }).format(date);
            },
          },
          time: {
            displayFormats: {
              hour: "MMM d, h a",
            },
          },
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Pollen Level",
          },
        },
      },
    };
  });

  return {
    chartData,
    chartOptions,
    loading,
    error,
    maxPollenLevel,
  };
}
