import type { PollenSeries, PollenType } from '../types';

export function toMultiPollenLineChartData(series: PollenSeries, selectedTypes: PollenType[]) {
	if (!series.instants) return [];

	return series.instants.map((instant) => {
		const dataPoint: Record<string, number | Date> = {
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
