import { DEFAULT_SEVERITY, POLLEN_SEVERITY } from './config';
import type { EnvironmentObservation } from '../types';
import type { EnvironmentObservationWithSeverity, PollenSeverityLevel } from './types';

function calculatePollenSeverity(value: number): PollenSeverityLevel {
	return POLLEN_SEVERITY.find((level) => value >= level.threshold) ?? DEFAULT_SEVERITY;
}

export function getPollenSeverity(severityId: PollenSeverityLevel['id']): PollenSeverityLevel {
	return POLLEN_SEVERITY.find((severity) => severity.id === severityId) ?? DEFAULT_SEVERITY;
}

export function addSeverityToObservation(
	observation: EnvironmentObservation
): EnvironmentObservationWithSeverity {
	return {
		...observation,
		pollen: observation.pollen.map((measurement) => ({
			...measurement,
			severity: calculatePollenSeverity(measurement.value)
		}))
	};
}

export function addSeverityToObservations(
	observations: EnvironmentObservation[]
): EnvironmentObservationWithSeverity[] {
	return observations.map(addSeverityToObservation);
}
