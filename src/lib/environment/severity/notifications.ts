import { POLLEN_SEVERITY } from './config';
import type {
	PollenSeriesWithSeverity,
	PollenSeverityLevel,
	PollenSeverityNotification
} from './types';

export function createPollenSeverityNotifications(
	series: PollenSeriesWithSeverity,
	thresholdId: PollenSeverityLevel['id']
): PollenSeverityNotification[] {
	const threshold = POLLEN_SEVERITY.find((level) => level.id === thresholdId);

	if (!threshold) {
		return [];
	}

	return series.instants.flatMap((instant) =>
		instant.metrics
			.filter((metric) => metric.severity.threshold >= threshold.threshold)
			.map((metric) => ({
				timestamp: instant.createdAt,
				location: series.location,
				pollen: metric.type,
				value: metric.value,
				unit: metric.unit,
				severity: metric.severity
			}))
	);
}
