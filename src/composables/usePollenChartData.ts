import { computed, type Ref } from "vue";
import { OPENMETEO_POLLEN_TYPES } from "../config";
import { useOpenMeteoAPI } from "./useOpenMeteo";
import { chartColors } from "../utils/chartColors";
import { usePollenFilters } from "../composables/usePollenFilters";
import type { ChartData, ChartDataset, ChartOptions } from "chart.js";
import type { PollenType } from "../interfaces/PollenTypes";
import type { PollenRecord } from "../interfaces/Pollen";

const { levelFilter, typeFilter, applyFilters } = usePollenFilters();

export function usePollenChartData(
  minLevel: Ref<number>,
  selectedPollenTypes: Ref<PollenType[]>,
): {
  chartData: Ref<ChartData<"line">>;
  chartOptions: Ref<ChartOptions<"line">>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  maxPollenLevel: Ref<number>;
} {
  const { data, loading, error } = useOpenMeteoAPI();

  const maxPollenLevel = computed<number>(() => {
    if (!data.value) return 0;

    let maxLevel = 0;
    data.value.records.forEach((record: PollenRecord) => {
      OPENMETEO_POLLEN_TYPES.forEach((pollenType) => {
        const level = record.levels[pollenType];
        if (level !== null && level > maxLevel) {
          maxLevel = Math.ceil(level);
        }
      });
    });
    return maxLevel;
  });

  const filteredPollenData = computed(() => {
    const filters = [];

    if (!data.value) {
      return { records: [] };
    }

    if (minLevel.value > 0) {
      filters.push(levelFilter(minLevel.value));
    }

    if (selectedPollenTypes.value.length > 0) {
      filters.push(typeFilter(selectedPollenTypes.value));
    }

    return applyFilters(data.value, filters);
  });

  const chartData = computed<ChartData<"line">>(() => {
    if (!data.value) return { datasets: [] };

    const datasets: ChartDataset<"line">[] = [];

    OPENMETEO_POLLEN_TYPES.forEach((pollenType, index) => {
      const dataPoints = filteredPollenData.value.records.reduce(
        (acc: { x: number; y: number }[], record: PollenRecord) => {
          const level = record.levels[pollenType];
          if (level !== null) {
            const timestamp = record.timestamp.getTime();
            acc.push({ x: timestamp, y: level });
          }
          return acc;
        },
        [],
      );

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

    return { datasets };
  });

  // Chart options computation
  const chartOptions = computed<ChartOptions<"line">>(() => ({
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
  }));

  return {
    chartData,
    chartOptions,
    loading,
    error,
    maxPollenLevel,
  };
}
