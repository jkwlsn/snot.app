import { ref } from 'vue';
import { POLLEN_DISPLAY_NAMES } from '../pollen';
import { usePollenSeverity } from './usePollenSeverity';
import { formatAlertTimeRanges } from './../utils/timeUtils';

const permissionGranted = ref(false);
const { getSeverity } = usePollenSeverity();

const requestPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    return;
  }

  if (Notification.permission === 'granted') {
    permissionGranted.value = true;
    return;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    permissionGranted.value = permission === 'granted';
  }
};

const sendNotification = (title, options) => {
  if (permissionGranted.value) {
    new Notification(title, options);
  } else {
    console.warn('Notification permission not granted.');
  }
};

const sendPollenAlertNotification = (newWarnings, limitMap) => {
  const summarizedNotifications = {};

  newWarnings.forEach(({ pollenKey, pollenValue, time }) => {
    if (time instanceof Date && !isNaN(time.getTime())) {
      if (!summarizedNotifications[pollenKey]) {
        summarizedNotifications[pollenKey] = [];
      }
      summarizedNotifications[pollenKey].push({ time, value: pollenValue });
    }
  });

  for (const pollenKey in summarizedNotifications) {
    const alerts = summarizedNotifications[pollenKey];
    if (alerts.length > 0) {
      const maxPollenValue = Math.max(...alerts.map((a) => a.value));
      const formattedTimeRanges = formatAlertTimeRanges(alerts);

      const limit = limitMap[pollenKey];
      const severity = getSeverity(pollenKey, maxPollenValue);
      const displayName = POLLEN_DISPLAY_NAMES?.[pollenKey] ?? pollenKey;
      const body = `⏰ ${formattedTimeRanges.join(', ')} ${severity.emoji} ${severity.label} ${displayName} pollen (max: ${Math.round(maxPollenValue)}, limit: ${limit})`;
      try {
        sendNotification('Pollen Alert!', { body, icon: '/favicon.ico' });
        if ('vibrate' in navigator && severity.label === 'Very High') {
          navigator.vibrate([300, 100, 300]);
        }
      } catch (err) {
        console.error('Notification or vibration error:', err);
      }
    }
  }
};

export function useNotifications() {
  return {
    permissionGranted,
    requestPermission,
    sendNotification,
    sendPollenAlertNotification,
  };
}