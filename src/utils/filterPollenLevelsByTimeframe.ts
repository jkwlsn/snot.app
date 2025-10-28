import type { Timeframe } from "../interfaces/Timeframe";
import type { PollenRecord } from "../interfaces/Pollen";
import { zeroUTCMinutes } from "./zeroUTCMinutes";

function filterPollenDataByTimeframe(
  data: readonly PollenRecord[],
  timeframe: Timeframe,
): PollenRecord[] {
  const result: PollenRecord[] = [];

  const startTimestamp = zeroUTCMinutes(timeframe.startTime).getTime();
  const endTimestamp = timeframe.endTime.getTime();

  for (const record of data) {
    const currentTimestamp = record.timestamp.getTime();

    if (
      currentTimestamp >= startTimestamp &&
      currentTimestamp <= endTimestamp
    ) {
      result.push(record);
    } else if (currentTimestamp > endTimestamp) {
      break;
    }
  }

  return result;
}

export const usefilterPollenDataByTimeframe = (): {
  filterPollenDataByTimeframe: (
    data: readonly PollenRecord[],
    timeframe: Timeframe,
  ) => PollenRecord[];
} => {
  return {
    filterPollenDataByTimeframe,
  };
};
