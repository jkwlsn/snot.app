import { POLLEN_SEVERITY } from './config';
import type { EnvironmentObservation } from '../types';
import type { EnvironmentObservationWithSeverity, PollenSeverityLevel } from './types';

function calculatePollenSeverity(value: number): PollenSeverityLevel {
	return (
		POLLEN_SEVERITY.find((severity) => value >= severity.threshold) ??
		POLLEN_SEVERITY[POLLEN_SEVERITY.length - 1]
	);
}

export function getPollenSeverity(severityId: PollenSeverityLevel['id']): PollenSeverityLevel {
	return (
		POLLEN_SEVERITY.find((severity) => severityId === severity.id) ??
		POLLEN_SEVERITY[POLLEN_SEVERITY.length - 1]
	);
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
