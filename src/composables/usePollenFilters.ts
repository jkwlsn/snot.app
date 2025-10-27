import { type PollenData, type PollenRecord } from "../interfaces/Pollen";
import { type PollenLevels } from "../interfaces/PollenTypes";

// This function takes a PollenData object, defined in /interfaces/pollen,
// and a number representing the pollen level threshold for the filter.
// It returns a new PollenData object containing only the pollen types with
// levels above the threshold.
export function filterPollenByLevel(
  pollenData: PollenData,
  minLevel: number,
): PollenData {
  const newRecords = pollenData.records
    .map((record) => {
      // map over all recorsd in pollenData
      const newLevels: PollenLevels = { ...record.levels };
      let hasHighPollen = false;

      // Create new array containing pollens with levels above threshold
      for (const pollenType in newLevels) {
        const level = newLevels[pollenType];
        // If the pollen level is below the threshold, set it to null
        if (level !== null && level < minLevel) {
          newLevels[pollenType] = null;
        }
        // Otherwise, set hasHighPollen to true
        if (newLevels[pollenType] !== null) {
          hasHighPollen = true;
        }
      }

      return hasHighPollen ? { ...record, levels: newLevels } : null;
    })
    .filter((record): record is PollenRecord => record !== null);
  //filter out all records which contain null pollen level

  return {
    ...pollenData,
    records: newRecords,
  };
}
