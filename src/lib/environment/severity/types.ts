import type { UTCDate } from '@date-fns/utc';
import type { EnvironmentObservation, PollenMeasurement, PollenType, PollenUnit } from '../types';
import type { LocationCoordinates } from '$lib/location';

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
