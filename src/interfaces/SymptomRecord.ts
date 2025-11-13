import type { Coordinates } from "./Coordinates";
import type { PollenRecord } from "./Pollen";

interface SymptomRecord {
  id: number;
  type: string;
  severity: number;
  timestamp: Date;
  location: Coordinates;
  pollenData: PollenRecord[];
}

export type NewSymptomRecord = Omit<SymptomRecord, "id">;

export type { SymptomRecord };
