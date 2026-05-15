import { startOfDay } from 'date-fns';
import { aggregateInstants } from '../utils/pollen';
import type { PollenInstant, PollenSeries } from '../types';

export function aggregateToDaily(series: PollenSeries): PollenSeries {
	const dailyMap = new Map<number, PollenInstant[]>();

	for (let i = 0; i < series.instants.length; i++) {
		const instant = series.instants[i];
		const dayStart = startOfDay(instant.createdAt).getTime();
		let group = dailyMap.get(dayStart);
		if (!group) {
			group = [];
			dailyMap.set(dayStart, group);
		}
		group.push(instant);
	}

	const aggregatedInstants: PollenInstant[] = [];
	for (const [timestamp, instants] of dailyMap) {
		aggregatedInstants.push(aggregateInstants(instants, new Date(timestamp)));
	}

	return {
		...series,
		createdAt: aggregatedInstants[0]?.createdAt ?? series.createdAt,
		instants: aggregatedInstants
	};
}
