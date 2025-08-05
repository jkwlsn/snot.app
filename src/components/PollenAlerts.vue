<template>
  <section>
    <h2>Pollen Alerts</h2>
    <div v-if="isLoading">Loading pollen data...</div>
    <div v-else-if="fetchError" class="error">Error: {{ fetchError }}</div>
    <ul v-else-if="groupedWarnings.length">
      <li v-for="(group, i) in groupedWarnings" :key="i">
        ⏰ {{ group.timeRange }} {{ pollenEmoji }} High Pollen:
        {{ group.pollenInfo }}
      </li>
    </ul>
    <div v-else>No pollen alerts at this time.</div>
  </section>
</template>

<script setup>
import { usePollenData } from '../composables/usePollenData';
import { usePollenAlerts } from '../composables/usePollenAlerts';
import { useUserSettings } from '../composables/useUserSettings';
import { computed } from 'vue';

const { parsedData, isLoading, fetchError } = usePollenData();
const warnings = usePollenAlerts(parsedData);
const { settings } = useUserSettings();

const pollenEmoji = '🌿';

const getLimit = () => {
  const sensitivity = settings.value.sensitivity;
  return Math.round(200 / sensitivity);
};

const groupedWarnings = computed(() => {
  if (!warnings.value || warnings.value.length === 0) {
    return [];
  }

  const sortedWarnings = [...warnings.value].sort(
    (a, b) => a.time.getTime() - b.time.getTime(),
  );

  const consolidatedAlerts = [];

  let currentRange = null;

  sortedWarnings.forEach((warning) => {
    const pollenLimit = getLimit(warning.pollenKey);

    if (currentRange === null) {
      currentRange = {
        startTime: warning.time,
        endTime: warning.time,
        pollenDetails: {
          [warning.pollenKey]: {
            maxPollenValue: warning.pollenValue,
            limit: pollenLimit,
          },
        },
      };
    } else {
      const isConsecutive =
        warning.time.getTime() ===
        currentRange.endTime.getTime() + 60 * 60 * 1000;

      if (isConsecutive) {
        currentRange.endTime = warning.time;
        if (!currentRange.pollenDetails[warning.pollenKey]) {
          currentRange.pollenDetails[warning.pollenKey] = {
            maxPollenValue: warning.pollenValue,
            limit: pollenLimit,
          };
        } else {
          currentRange.pollenDetails[warning.pollenKey].maxPollenValue =
            Math.max(
              currentRange.pollenDetails[warning.pollenKey].maxPollenValue,
              warning.pollenValue,
            );
        }
      } else {
        consolidatedAlerts.push(currentRange);
        currentRange = {
          startTime: warning.time,
          endTime: warning.time,
          pollenDetails: {
            [warning.pollenKey]: {
              maxPollenValue: warning.pollenValue,
              limit: pollenLimit,
            },
          },
        };
      }
    }
  });

  if (currentRange !== null) {
    consolidatedAlerts.push(currentRange);
  }

  return consolidatedAlerts.map((range) => {
    const timeRangeString = `${range.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${range.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const pollenList = Object.keys(range.pollenDetails)
      .map((pollenKey) => {
        const details = range.pollenDetails[pollenKey];
        return `${pollenKey} (${Math.round(details.maxPollenValue)})`;
      })
      .join(', ');

    return {
      timeRange: timeRangeString,
      pollenInfo: pollenList,
    };
  });
});
</script>
