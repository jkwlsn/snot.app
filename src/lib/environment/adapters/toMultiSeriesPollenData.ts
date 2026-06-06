import type { PollenSeries, PollenType } from '../types';
import type { MultiSeriesDataPoint } from '$lib/graphs';

export function toMultiSeriesPollenData(
	series: PollenSeries,
	selectedTypes: PollenType[]
): MultiSeriesDataPoint[] {
	if (!series.instants) return [];

	return series.instants.map((instant) => {
		const dataPoint: MultiSeriesDataPoint = {
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
