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

  for (let i = 0; i < data.length; i++) {
    const currentTimestamp = data[i].timestamp.getTime();

    if (
      currentTimestamp >= startTimestamp &&
      currentTimestamp <= endTimestamp
    ) {
      result.push(data[i]);
    } else if (currentTimestamp > endTimestamp) {
      break;
    }
  }

  return result;
}

export const usefilterPollenDataByTimeframe = () => {
  return {
    filterPollenDataByTimeframe,
  };
};
