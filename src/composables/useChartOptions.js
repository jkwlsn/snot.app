// src/composables/useChartOptions.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useChartOptions(getChartSpecificOptions) {
  const chartOptions = ref({});

  const updateChartOptions = () => {
    const isMobile = window.innerWidth < 768;
    const isDarkMode = document.documentElement.classList.contains('dark');

    const textColor = isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(31, 41, 55)'; // gray-100 vs gray-800
    const gridColor = isDarkMode ? 'rgba(243, 244, 246, 0.2)' : 'rgba(31, 41, 55, 0.3)';
    const tooltipBgColor = isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)';

    const specificOptions = getChartSpecificOptions({ isMobile, textColor });

    chartOptions.value = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: specificOptions.yTitle,
            color: textColor,
          },
          ticks: {
            color: textColor,
          },
          grid: {
            color: gridColor,
          },
        },
        x: {
          ticks: {
            maxRotation: isMobile ? 90 : 0,
            minRotation: isMobile ? 90 : 0,
            color: textColor,
          },
          grid: {
            color: gridColor,
          },
        },
      },
      plugins: {
        legend: {
          display: specificOptions.legendDisplay,
          labels: {
            color: textColor,
          },
        },
        tooltip: {
          backgroundColor: tooltipBgColor,
          titleColor: textColor,
          bodyColor: textColor,
        },
      },
    };
  };

  onMounted(() => {
    updateChartOptions();
    window.addEventListener('resize', updateChartOptions);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateChartOptions);
  });

  return {
    chartOptions,
  };
}
