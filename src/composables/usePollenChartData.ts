import { computed, type Ref } from "vue";
import { OPENMETEO_POLLEN_TYPES } from "../config";
import { chartColors } from "../utils/chartColors";
import type { ChartData, ChartDataset, ChartOptions } from "chart.js";
import type { PollenData, PollenRecord } from "../interfaces/Pollen";

export function usePollenChartData(pollenData: Ref<PollenData>): {
  chartData: Ref<ChartData<"line">>;
  chartOptions: Ref<ChartOptions<"line">>;
} {
  const chartData = computed<ChartData<"line">>(() => {
    if (!pollenData.value.records.length) return { datasets: [] };

    const datasets: ChartDataset<"line">[] = [];

    OPENMETEO_POLLEN_TYPES.forEach((pollenType, index) => {
      const dataPoints = pollenData.value.records.reduce(
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
  };
}
