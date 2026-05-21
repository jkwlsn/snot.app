import { parse } from 'date-fns';
import { toDayKey, toUTCDate, getUTCNow } from '$lib/date';
import type { SymptomLog } from '../types';
import type { TemporalDataPoint, GraphProvider } from '$lib/types';

function aggregateSymptomsByDay(records: SymptomLog[]): Map<string, number> {
	const totals = new Map<string, number>();

	for (const record of records) {
		const key = toDayKey(record.createdAt, record.timezone);
		totals.set(key, (totals.get(key) ?? 0) + 1);
	}

	return totals;
}

export const createLayerchartCalendarGraph: GraphProvider<SymptomLog, TemporalDataPoint> = {
	transform(records) {
		const totals = aggregateSymptomsByDay(records);
		return Array.from(totals.entries()).map(([key, value]) => ({
			createdAt: toUTCDate(parse(key, 'yyyy-MM-dd', getUTCNow())),
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			value
		}));
	}
};
