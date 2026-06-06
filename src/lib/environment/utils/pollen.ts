import { POLLEN_SEVERITY, POLLEN_UNITS, POLLENS } from '../config';
import type { PollenType, PollenSeries, PollenSeverityNumber } from '../types';

// This Map prepares data outside of loops
export const POLLEN_LOOKUP = new Map(POLLENS.map((p) => [p.id, p]));
export const UNIT_LOOKUP = new Map(POLLEN_UNITS.map((u) => [u.id, u]));

export function getPollenName(id: PollenType): string {
	return POLLEN_LOOKUP.get(id)?.name ?? id;
}

export function getPollenColor(id: PollenType): string {
	return POLLEN_LOOKUP.get(id)?.color ?? '#000000';
}

const DEFAULT_SEVERITY = POLLEN_SEVERITY[POLLEN_SEVERITY.length - 1];

export function calculateSeverity(value: number): PollenSeverityNumber {
	return POLLEN_SEVERITY.find((s) => value >= s.min) ?? DEFAULT_SEVERITY;
}

export function filterPollenByMetricValue(series: PollenSeries, threshold: number): PollenSeries {
	if (!series?.instants) {
		return { ...series, instants: [], pollenTypes: [] };
	}

	const filteredInstants = series.instants
		.map((instant) => ({
			...instant,
			metrics: instant.metrics.filter((metric) => metric.value > threshold)
		}))
		.filter((instant) => instant.metrics.length > 0);

	const filteredTypes = series.pollenTypes.filter((type) =>
		filteredInstants.some((instant) => instant.metrics.some((metric) => metric.type === type))
	);

	return {
		...series,
		pollenTypes: filteredTypes,
		instants: filteredInstants
	};
}
