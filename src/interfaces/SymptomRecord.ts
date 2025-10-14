import type { Coordinates } from "./coordinates";

interface SymptomRecord {
  id?: number;
  type: string;
  timestamp: Date;
  location: Coordinates;
}

export type { SymptomRecord };
