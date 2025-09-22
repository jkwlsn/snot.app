// composables/useSneezeChartData.js
import { computed, ref, watch } from 'vue';
import { useSymptomTracker } from './useSymptomTracker';

export function useSymptomChartData(daysToShowRef) {
  const { symptoms } = useSymptomTracker();

  const _daysToShow = ref(daysToShowRef.value);

  watch(daysToShowRef, (newValue) => {
    _daysToShow.value = newValue;
  });

const symptomsByDay = computed(() => {
    const counts = {};
    symptoms.value.forEach((symptom) => {
      const date = new Date(symptom.time);
      const dateString = date.toISOString().slice(0, 10);
      counts[dateString] = (counts[dateString] || 0) + 1;
    });
    return counts;
  });

  const chartData = computed(() => {
    const today = new Date();

    const days = [];

    // Calculate end date: Today's date
    const endDate = today;

    // Calculate approximate number of months to go back
    const approximateMonths = Math.ceil(_daysToShow.value / 30);

    // Calculate start date: First day of the month 'approximateMonths' ago
    const startMonth = today.getMonth() - approximateMonths;
    const startYear = today.getFullYear();
    const startDate = new Date(startYear, startMonth, 1);
    startDate.setHours(0, 0, 0, 0); // Normalize

    // Iterate from startDate to endDate
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      days.push({
        date: dateString,
        count: symptomsByDay.value[dateString] || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1); // Move to next day
    }
    return days;
  });

  return {
    chartData,
  };
}
