import type { PollenSeries, PollenType } from '../types';
import type { UTCDate } from '$lib/date';

export function toMultiPollenLineChartData(series: PollenSeries, selectedTypes: PollenType[]) {
	if (!series.instants) return [];

	return series.instants.map((instant) => {
		const dataPoint: Record<string, number | UTCDate> = {
			createdAt: instant.createdAt
		};

		instant.metrics.forEach((metric) => {
			if (selectedTypes.includes(metric.type)) {
				dataPoint[metric.type] = metric.value;
			}
		});

		return dataPoint;
	});
}
