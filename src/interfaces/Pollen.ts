import type { Coordinates } from "./Coordinates";
import type { PollenLevels } from "./PollenTypes";

export interface PollenRecord {
  timestamp: Date;
  levels: PollenLevels;
}

export interface PollenData extends Coordinates {
  records: readonly PollenRecord[];
}
