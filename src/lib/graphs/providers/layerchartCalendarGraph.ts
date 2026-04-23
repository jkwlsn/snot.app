import { format, parse, startOfDay } from 'date-fns';
import type { SymptomLog } from '$lib/types';
import type { TemporalDataPoint, GraphProvider } from '../types';

function aggregateSymptomsByDay(records: SymptomLog[]): Map<string, number> {
	const totals = new Map<string, number>();

	const toKey = (createdAt: Date) => format(startOfDay(createdAt), 'yyyy-MM-dd'); // formats createdAts as `yyyy-MM-dd` and sets time to 00:00 (startOfDay)

	for (const record of records) {
		const key = toKey(record.createdAt);
		totals.set(key, (totals.get(key) ?? 0) + 1);
	}

	return totals;
}

export const createLayerchartCalendarGraph: GraphProvider<SymptomLog, TemporalDataPoint> = {
	transform(records) {
		const totals = aggregateSymptomsByDay(records);
		// Turn Map() into array of objects
		return Array.from(totals.entries()).map(([key, value]) => ({
			createdAt: parse(key, 'yyyy-MM-dd', new Date()),
			value
		}));
	}
};
