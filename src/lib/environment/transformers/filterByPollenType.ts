import type { PollenSeries, PollenType } from '../types';

export function filterByPollenTypes(series: PollenSeries, types: PollenType[]): PollenSeries {
	const filteredInstants = series.instants
		.map((instant) => ({
			...instant,
			metrics: instant.metrics.filter((metric) => types.includes(metric.type))
		}))
		.filter((instant) => instant.metrics.length > 0);

	return {
		...series,
		pollenTypes: series.pollenTypes.filter((t) => types.includes(t)),
		instants: filteredInstants
	};
}
