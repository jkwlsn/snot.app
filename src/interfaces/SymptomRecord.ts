import type { Coordinates } from "./Coordinates";
import { PollenData, PollenRecord } from "./Pollen";

interface SymptomRecord {
  id?: number;
  type: string;
  timestamp: Date;
  location: Coordinates;
  pollenData: PollenRecord[];
}

export type { SymptomRecord };
