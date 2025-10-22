import type { Timeframe } from "../interfaces/Timeframe.ts";

export const createTimeframe = (
  startTime: Date = new Date(),
  plusHours = 1,
): Timeframe => {
  const startTimeframe = new Date(startTime);
  const endTimeframe = new Date(startTime);

  endTimeframe.setUTCHours(startTimeframe.getUTCHours() + plusHours);

  return { startTime: startTimeframe, endTime: endTimeframe };
};
