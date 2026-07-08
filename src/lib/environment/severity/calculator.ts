import { DEFAULT_SEVERITY, POLLEN_SEVERITY } from './config';
import type { PollenInstant, PollenSeries } from '../types';
import type {
	PollenInstantWithSeverity,
	PollenSeriesWithSeverity,
	PollenSeverityLevel
} from './types';

function calculatePollenSeverity(value: number): PollenSeverityLevel {
	return POLLEN_SEVERITY.find((level) => value >= level.threshold) ?? DEFAULT_SEVERITY;
}

export function addSeverityToInstant(instant: PollenInstant): PollenInstantWithSeverity {
	return {
		...instant,
		metrics: instant.metrics.map((metric) => ({
			...metric,
			severity: calculatePollenSeverity(metric.value)
		}))
	};
}

export function addSeverityToSeries(series: PollenSeries): PollenSeriesWithSeverity {
	return { ...series, instants: series.instants.map(addSeverityToInstant) };
}
