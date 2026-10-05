import type { UTCDate } from "$lib/date";
import type { LocationCoordinates } from "$lib/location";
import type { EnvironmentObservation, PollenMeasurement, PollenType, PollenUnit } from "../types";

export interface PollenSeverityLevel {
  id: number;
  level: string;
  threshold: number;
  symbol: string;
  description: string;
}

export interface PollenMeasurementWithSeverity extends PollenMeasurement {
  severity: PollenSeverityLevel;
}

export interface EnvironmentObservationWithSeverity extends EnvironmentObservation {
  pollen: PollenMeasurementWithSeverity[];
}

export interface PollenSeverityNotification {
  timestamp: UTCDate;
  location: LocationCoordinates | null;
  pollen: PollenType;
  value: number;
  unit: PollenUnit;
  severity: PollenSeverityLevel;
}
