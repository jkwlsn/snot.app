import type { PollenSeries, PollenType } from '../types';
import type { TemporalDataPoint } from '$lib/types/graphs';

export function toPollenBarChartData(
	series: PollenSeries,
	pollenKey: PollenType
): TemporalDataPoint[] {
	if (!series.instants) return [];

	return series.instants.map((instant) => {
		const metric = instant.metrics.find((m) => m.type === pollenKey);
		return {
			createdAt: instant.createdAt,
			value: metric?.value ?? 0
		};
	});
}
