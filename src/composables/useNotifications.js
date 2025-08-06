import { ref } from 'vue';
import { POLLEN_DISPLAY_NAMES } from '../pollen';

export function useNotifications() {
  const permissionGranted = ref(false);

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
        alerts.sort((a, b) => a.time.getTime() - b.time.getTime());
        const maxPollenValue = Math.max(...alerts.map((a) => a.value));
        const formattedTimeRanges = [];
        let startTime = alerts[0].time;
        let endTime = alerts[0].time;

        for (let i = 1; i < alerts.length; i++) {
          const currentTime = alerts[i].time;
          const prevTime = alerts[i - 1].time;
          if (currentTime.getTime() === prevTime.getTime() + 60 * 60 * 1000) {
            endTime = currentTime;
          } else {
            formattedTimeRanges.push(
              `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            );
            startTime = currentTime;
            endTime = currentTime;
          }
        }

        formattedTimeRanges.push(
          `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        );

        const limit = limitMap[pollenKey];

        const displayName = POLLEN_DISPLAY_NAMES?.[pollenKey] ?? pollenKey;
        let body = `⏰ ${formattedTimeRanges.join(', ')} 🌿 High ${displayName} pollen (max: ${Math.round(maxPollenValue)}, limit: ${limit})`;

        sendNotification('Pollen Alert!', {
          body,
          icon: '/favicon.ico',
        });
      }
    }
  };

  return {
    permissionGranted,
    requestPermission,
    sendNotification,
    sendPollenAlertNotification,
  };
}
