import { Coordinates } from "./coordinates";

interface Symptom {
  id: number;
  timestamp: number;
  type: string;
  location: Coordinates;
}

export type { Symptom };
