import { getUnixTime } from "date-fns";
import type { Timeframe } from "../interfaces/Timeframe";
import type { PollenRecord } from "../interfaces/Pollen";

export function filterPollenDataByTimeframe(
  data: readonly PollenRecord[],
  timeframe: Timeframe,
): PollenRecord[] {
  const result: PollenRecord[] = [];

  const startTimestamp = getUnixTime(timeframe.startTime);
  const endTimestamp = getUnixTime(timeframe.endTime);

  for (const record of data) {
    const currentTimestamp = getUnixTime(record.timestamp);

    if (
      currentTimestamp >= startTimestamp &&
      currentTimestamp < endTimestamp
    ) {
      result.push(record);
    } else if (currentTimestamp >= endTimestamp) {
      break;
    }
  }

  return result;
}
