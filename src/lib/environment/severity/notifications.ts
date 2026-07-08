import { getPollenSeverity } from './calculator';
import type {
	EnvironmentObservationWithSeverity,
	PollenSeverityLevel,
	PollenSeverityNotification
} from './types';

export function createPollenSeverityNotifications(
	observation: EnvironmentObservationWithSeverity,
	thresholdId: PollenSeverityLevel['id']
): PollenSeverityNotification[] {
	const severity = getPollenSeverity(thresholdId);

	return observation.pollen
		.filter((pollen) => pollen.value >= severity.threshold)
		.map((measurement) => ({
			timestamp: observation.createdAt,
			location: observation.location,
			pollen: measurement.type,
			value: measurement.value,
			unit: measurement.unit,
			severity: measurement.severity
		}));
}
