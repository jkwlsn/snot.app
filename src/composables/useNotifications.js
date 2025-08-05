import { ref } from 'vue';

export function useNotifications() {
  const permissionGranted = ref(false);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission === "granted") {
      permissionGranted.value = true;
      return;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      permissionGranted.value = permission === "granted";
    }
  };

  const sendNotification = (title, options) => {
    if (permissionGranted.value) {
      new Notification(title, options);
    } else {
      console.warn("Notification permission not granted.");
    }
  };

  const sendPollenAlertNotification = (newWarnings, limit) => {
    // Group warnings by pollenKey and summarize timestamps
    const summarizedNotifications = {};
    newWarnings.forEach(({ pollenKey, pollenValue, time }) => {
      if (time instanceof Date && !isNaN(time.getTime())) { // Ensure time is a valid Date object
        if (!summarizedNotifications[pollenKey]) {
          summarizedNotifications[pollenKey] = [];
        }
        summarizedNotifications[pollenKey].push({ time, value: pollenValue });
      }
    });

    // Send summarized notifications for new warnings
    for (const pollenKey in summarizedNotifications) {
      const alerts = summarizedNotifications[pollenKey];
      if (alerts.length > 0) {
        // Sort alerts by time
        alerts.sort((a, b) => a.time.getTime() - b.time.getTime());

        const maxPollenValue = Math.max(...alerts.map(a => a.value));
        const times = alerts.map(a => a.time);

        let emoji = '🌿'; // Leaf emoji for all pollen types

        const formattedTimeRanges = [];
        if (alerts.length > 0) {
          let startTime = alerts[0].time;
          let endTime = alerts[0].time;

          for (let i = 1; i < alerts.length; i++) {
            const currentTime = alerts[i].time;
            const prevTime = alerts[i - 1].time;
            // Check if the current time is exactly one hour after the previous time
            if (currentTime.getTime() === prevTime.getTime() + (60 * 60 * 1000)) {
              endTime = currentTime;
            } else {
              // If not consecutive, add the previous range and start a new one
              formattedTimeRanges.push(`${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
              startTime = currentTime;
              endTime = currentTime;
            }
          }
          // Add the last range
          formattedTimeRanges.push(`${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
        }

        let body = `⏰ ${formattedTimeRanges.join(', ')} ${emoji} High ${pollenKey} Pollen (max: ${Math.round(maxPollenValue)}, limit: ${limit})`;

        sendNotification('Pollen Alert!', {
          body: body,
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
