import { computed, type Ref } from "vue";
import type { ChartData, ChartOptions } from "chart.js";

const colors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#FFCD56",
  "#C9CBCF",
  "#7B68EE",
  "#3CB371",
];

export function useDoughnutChart(counts: Ref<Map<string, number>>): {
  data: Ref<ChartData<"doughnut">>;
  options: Ref<ChartOptions<"doughnut">>;
} {
  const chartData = computed<ChartData<"doughnut">>(() => {
    const labels: string[] = [];
    const data: number[] = [];
    const backgroundColors: string[] = [];
    let colorIndex = 0;

    counts.value.forEach((count, type) => {
      labels.push(type);
      data.push(count);
      backgroundColors.push(colors[colorIndex % colors.length]);
      colorIndex++;
    });

    return {
      labels: labels,
      datasets: [
        {
          backgroundColor: backgroundColors,
          data: data,
        },
      ],
    };
  });

  const chartOptions = computed<ChartOptions<"doughnut">>(() => ({
    responsive: true,
    maintainAspectRatio: true,
    animation: false,
    hoverOffset: 100,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context): string {
            const label = context.label || "";
            const value = context.raw;
            const total = chartData.value.datasets[0].data.reduce(
              (sum, val) => sum + val,
              0,
            );
            const percentage =
              total > 0 ? ((Number(value) / total) * 100).toFixed(2) : "0.00";
            return `${label}: ${String(value)} (${percentage}%)`;
          },
        },
      },
      title: {
        display: false,
      },
    },
  }));

  return { data: chartData, options: chartOptions };
}
