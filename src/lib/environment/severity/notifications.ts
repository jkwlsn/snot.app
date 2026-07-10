import { getPollenSeverity } from './calculator';
import type {
	EnvironmentObservationWithSeverity,
	PollenSeverityLevel,
	PollenSeverityNotification
} from './types';

export function createPollenSeverityNotifications(
	observation: EnvironmentObservationWithSeverity,
	severityLevelId: PollenSeverityLevel['id']
): PollenSeverityNotification[] {
	const severityLevel = getPollenSeverity(severityLevelId);

	return observation.pollen
		.filter((pollen) => pollen.value >= severityLevel.threshold)
		.map((measurement) => ({
			timestamp: observation.createdAt,
			location: observation.location,
			pollen: measurement.type,
			value: measurement.value,
			unit: measurement.unit,
			severity: measurement.severity
		}));
}
