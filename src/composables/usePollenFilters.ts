import { type PollenData, type PollenRecord } from "../interfaces/Pollen";
import { type PollenLevels, type PollenType } from "../interfaces/PollenTypes";

function applyLevelFilter(
  record: PollenRecord,
  levelFilterFn: (pollenType: PollenType, level: number | null) => boolean,
): PollenRecord | null {
  const newLevels: PollenLevels = { ...record.levels };
  let hasValidPollenLevel = false;

  for (const pollenType in newLevels) {
    const level = newLevels[pollenType];
    if (!levelFilterFn(pollenType, level)) {
      newLevels[pollenType] = null;
    }
    if (newLevels[pollenType] !== null) {
      hasValidPollenLevel = true;
    }
  }

  return hasValidPollenLevel ? { ...record, levels: newLevels } : null;
}

export function filterPollenByLevel(
  pollenData: PollenData,
  minLevel: number,
): PollenData {
  const newRecords = pollenData.records
    .map((record) =>
      applyLevelFilter(
        record,
        (_, level) => level !== null && level >= minLevel,
      ),
    )
    .filter((record): record is PollenRecord => record !== null);

  return {
    ...pollenData,
    records: newRecords,
  };
}

export function filterPollenByType(
  pollenData: PollenData,
  selectedPollenTypes: PollenType[],
): PollenData {
  const newRecords = pollenData.records
    .map((record) =>
      applyLevelFilter(record, (pollenType) =>
        selectedPollenTypes.includes(pollenType),
      ),
    )
    .filter((record): record is PollenRecord => record !== null);

  return {
    ...pollenData,
    records: newRecords,
  };
}
