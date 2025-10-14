import type { Timeframe } from "../interfaces/Timeframe";

import { zeroMinutes } from "./zeroMinutes";

type PollenDataMap = Record<string, number | null>;

type PeriodPollenData = Record<string, PollenDataMap>;

type FilteredPollenData = PeriodPollenData[];

export interface RawPollenData {
  time: string[];
  [pollenType: string]: PollenDataMap | string[];
}

function filterPollenDataByTimeframe(
  data: RawPollenData,
  timeframe: Timeframe,
): PeriodPollenData[] {
  const { time, ...pollenLevels } = data;
  const result: FilteredPollenData = [];

  const startTimestamp = zeroMinutes(timeframe.startTime).getTime();
  const endTimestamp = timeframe.endTime.getTime();

  const normalisedPollenData: Record<string, (number | null)[]> = {};

  for (const pollenType in pollenLevels) {
    if (Array.isArray(pollenLevels[pollenType])) continue;
    normalisedPollenData[pollenType] = Object.values(
      pollenLevels[pollenType] as Record<string, number | null>,
    );
  }

  let startIndex = -1;
  let endIndex = -1;

  for (let i = 0; i < time.length; i++) {
    const currentTimestamp = new Date(time[i]).getTime();

    if (startIndex === -1 && currentTimestamp >= startTimestamp) {
      startIndex = i;
    }

    if (currentTimestamp <= endTimestamp) {
      endIndex = i;
    } else if (currentTimestamp > endTimestamp) {
      break;
    }
  }

  if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
    return [];
  }

  const pollenTypes = Object.keys(normalisedPollenData);

  for (let i = startIndex; i <= endIndex; i++) {
    const currentTime = time[i];
    const timePollenMap: PollenDataMap = {};

    pollenTypes.forEach((pollenType) => {
      const levels = normalisedPollenData[pollenType];
      timePollenMap[pollenType] = levels[i];
    });

    const timeEntry: PeriodPollenData = {};
    timeEntry[currentTime] = timePollenMap;
    result.push(timeEntry);
  }

  return result;
}

export const usefilterPollenDataByTimeframe = () => {
  return {
    filterPollenDataByTimeframe,
  };
};
