import type { EnvironmentObservationSeries, PollenType } from '../types';
import type { UTCDate } from '$lib/date';

export function toMultiPollenLineChartData(
	series: EnvironmentObservationSeries,
	selectedTypes: PollenType[]
) {
	if (!series) return [];

	return series.observations.map((observation) => {
		const dataPoint: Record<string, number | UTCDate> = {
			createdAt: observation.createdAt
		};

		observation.pollen.forEach((p) => {
			if (selectedTypes.includes(p.type)) {
				dataPoint[p.type] = p.value;
			}
		});

		return dataPoint;
	});
}
