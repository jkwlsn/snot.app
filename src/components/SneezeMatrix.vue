<template>
  <section
    class="bg-emerald-200 rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Sneeze Activity</h2>
    <div class="relative">
      <div class="grid grid-flow-col grid-rows-1 gap-0 pt-4 text-xs mb-1 pointer-events-none">
        <span
          v-for="month in monthLabels"
          :key="month.name"
          :style="{ 'grid-column-start': month.columnIndex + 1 }"
          class="inline-block whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {{ month.name }}
        </span>
      </div>
      <div class="grid grid-flow-col grid-rows-7 gap-x-0 gap-y-1 pt-4">
        <div
          v-for="day in chartData"
          :key="day.date"
          class="w-2 h-2 rounded-sm"
                    :class="[getColor(day.count), { 'border-2 border-blue-500': String(day.date) === String(todayDateString.value) }]"
          @mouseover="showTooltip(day, $event)"
          @mouseleave="hideTooltip"
        ></div>
      </div>
      <div
        v-if="tooltip.visible"
        class="absolute bg-gray-900 text-white text-xs rounded py-1 px-2"
        :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
      >
        {{ tooltip.text }}
      </div>
    </div>
    <div class="flex justify-center mt-4 text-sm">
      <div class="flex items-center mr-4">
        <span class="w-4 h-4 rounded-sm bg-gray-300 mr-1"></span>
        <span>0</span>
      </div>
      <div class="flex items-center mr-4">
        <span class="w-4 h-4 rounded-sm bg-green-200 mr-1"></span>
        <span>1-2</span>
      </div>
      <div class="flex items-center mr-4">
        <span class="w-4 h-4 rounded-sm bg-green-400 mr-1"></span>
        <span>3-5</span>
      </div>
      <div class="flex items-center mr-4">
        <span class="w-4 h-4 rounded-sm bg-green-600 mr-1"></span>
        <span>6-10</span>
      </div>
      <div class="flex items-center">
        <span class="w-4 h-4 rounded-sm bg-green-800 mr-1"></span>
        <span>>10</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useSneezeChartData } from '../composables/useSneezeChartData';

const daysToShow = ref(90);

let resizeTimeout = null; // For debouncing

const updateDaysToShow = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (window.innerWidth >= 768) {
      daysToShow.value = 365;
    } else {
      daysToShow.value = 90;
    }
  }, 100); // Debounce by 100ms
};

onMounted(() => {
  updateDaysToShow();
  window.addEventListener('resize', updateDaysToShow);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateDaysToShow);
  clearTimeout(resizeTimeout); // Clear timeout on unmount
});

const { chartData } = useSneezeChartData(daysToShow);

const monthLabels = computed(() => {
  const labels = [];
  let currentMonth = -1;

  const firstDayDate = new Date(chartData.value[0].date);
  const dayOfWeek = (firstDayDate.getDay() + 6) % 7;

  chartData.value.forEach((day, index) => {
    const date = new Date(day.date);
    const month = date.getMonth();

    if (month !== currentMonth) {
      currentMonth = month;
      let monthName;

      if (daysToShow.value === 90) { // For 90-day view (mobile)
        monthName = date.toLocaleString('default', { month: 'narrow' });
      } else { // For 365-day view (desktop)
        monthName = date.toLocaleString('default', { month: 'short' });
      }

      const columnIndex = Math.floor((index + dayOfWeek) / 7);
      labels.push({ name: monthName, columnIndex: columnIndex });
    }
  });
  return labels;
});

const todayDateString = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
});



const getColor = (count) => {
  if (count === 0) return 'bg-gray-300';
  if (count <= 2) return 'bg-green-200';
  if (count <= 5) return 'bg-green-400';
  if (count <= 10) return 'bg-green-600';
  return 'bg-green-800';
};

const tooltip = ref({
  visible: false,
  text: '',
  x: 0,
  y: 0,
});

const showTooltip = (day, event) => {
  tooltip.value.visible = true;
  tooltip.value.text = `${day.count} sneezes on ${day.date}`;
  tooltip.value.x = event.target.offsetLeft - 60;
  tooltip.value.y = event.target.offsetTop - 30;
};

const hideTooltip = () => {
  tooltip.value.visible = false;
};
</script>
