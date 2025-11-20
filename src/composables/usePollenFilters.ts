import { type PollenData, type PollenRecord } from "../interfaces/Pollen";
import { type PollenType, type PollenLevels } from "../interfaces/PollenTypes";
import { type Timeframe } from "../interfaces/Timeframe";

type PollenFilter = (pollenRecord: PollenRecord) => PollenRecord | null;

export function usePollenFilters(): {
  applyFilters: (pollenData: PollenData, filters: PollenFilter[]) => PollenData;
  levelFilter: (minLevel: number) => PollenFilter;
  timeframeFilter: (timeframe: Timeframe) => PollenFilter;
  typeFilter: (selectedPollenTypes: PollenType[]) => PollenFilter;
} {
  const levelFilter =
    (minLevel: number): PollenFilter =>
    (pollenRecord: PollenRecord) => {
      const newLevels: PollenLevels = { ...pollenRecord.levels };

      let hasValidPollenLevel = false;

      for (const pollenType in newLevels) {
        const level = newLevels[pollenType];
        if (level !== null && level < minLevel) {
          newLevels[pollenType] = null;
        }
        if (newLevels[pollenType] !== null) {
          hasValidPollenLevel = true;
        }
      }

      if (hasValidPollenLevel) {
        return { ...pollenRecord, levels: newLevels };
      } else {
        return null;
      }
    };

  const typeFilter =
    (selectedPollenTypes: PollenType[]): PollenFilter =>
    (pollenRecord: PollenRecord) => {
      const newLevels: PollenLevels = { ...pollenRecord.levels };
      let hasASelectedPollenType = false;

      for (const pollenType in newLevels) {
        if (!selectedPollenTypes.includes(pollenType)) {
          newLevels[pollenType] = null;
        } else {
          hasASelectedPollenType = true;
        }
      }

      if (hasASelectedPollenType) {
        return { ...pollenRecord, levels: newLevels };
      } else {
        return null;
      }
    };

  const timeframeFilter =
    (timeframe: Timeframe): PollenFilter =>
    (pollenRecord: PollenRecord) => {
      const recordTimestamp = pollenRecord.timestamp;
      if (
        recordTimestamp >= timeframe.startTime &&
        recordTimestamp <= timeframe.endTime
      ) {
        return pollenRecord;
      } else {
        return null;
      }
    };

  const applyFilters = (
    pollenData: PollenData,
    filters: PollenFilter[],
  ): PollenData => {
    const newRecords = pollenData.records.reduce(
      (acc: PollenRecord[], pollenRecord: PollenRecord) => {
        const modifiedRecord = filters.reduce(
          (rec: PollenRecord | null, filter) => {
            if (rec === null) {
              return null;
            }
            return filter(rec);
          },
          pollenRecord,
        );

        if (modifiedRecord !== null) {
          acc.push(modifiedRecord);
        }
        return acc;
      },
      [],
    );

    return { ...pollenData, records: newRecords };
  };

  return {
    applyFilters,
    levelFilter,
    timeframeFilter,
    typeFilter,
  };
}
