import { startOfWeek } from 'date-fns';
import { aggregateInstants } from '../utils/pollen';
import type { PollenInstant, PollenSeries } from '../types';

export function aggregateToWeekly(series: PollenSeries): PollenSeries {
	const weeklyMap = new Map<number, PollenInstant[]>();

	for (let i = 0; i < series.instants.length; i++) {
		const instant = series.instants[i];
		const weekStart = startOfWeek(instant.createdAt, { weekStartsOn: 1 }).getTime();
		let group = weeklyMap.get(weekStart);
		if (!group) {
			group = [];
			weeklyMap.set(weekStart, group);
		}
		group.push(instant);
	}

	const aggregatedInstants: PollenInstant[] = [];
	for (const [timestamp, instants] of weeklyMap) {
		aggregatedInstants.push(aggregateInstants(instants, new Date(timestamp)));
	}

	return {
		...series,
		createdAt: aggregatedInstants[0]?.createdAt ?? series.createdAt,
		instants: aggregatedInstants
	};
}
