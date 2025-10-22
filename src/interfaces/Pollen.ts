import { Coordinates } from "./Coordinates";
import { PollenLevels } from "./PollenTypes";

export interface PollenRecord {
  timestamp: Date;
  levels: PollenLevels;
}

export interface PollenData extends Coordinates {
  records: PollenRecord[];
}
