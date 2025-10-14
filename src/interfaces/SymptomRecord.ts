import type { Coordinates } from "./Coordinates";

interface SymptomRecord {
  id?: number;
  type: string;
  timestamp: Date;
  location: Coordinates;
}

export type { SymptomRecord };
