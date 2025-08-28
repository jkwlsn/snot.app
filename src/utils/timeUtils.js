export function formatAlertTimeRanges(alerts) {
  if (!alerts || alerts.length === 0) return [];

  alerts.sort((a, b) => a.time.getTime() - b.time.getTime());

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

  return formattedTimeRanges;
}
