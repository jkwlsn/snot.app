import { format, parse, startOfDay } from 'date-fns';
import type { SymptomRecord } from '$lib/types';
import type { TemporalDataPoint, GraphProvider } from '../types';

function aggregateSymptomsByDay(records: SymptomRecord[]): Map<string, number> {
	const totals = new Map<string, number>();

	const toKey = (timestamp: Date) => format(startOfDay(timestamp), 'yyyy-MM-dd'); // formats timestamps as `yyyy-MM-dd` and sets time to 00:00 (startOfDay)

	for (const record of records) {
		const key = toKey(record.timestamp);
		totals.set(key, (totals.get(key) ?? 0) + 1);
	}

	return totals;
}

export const createLayerchartCalendarGraph: GraphProvider<TemporalDataPoint> = {
	transform(records) {
		const totals = aggregateSymptomsByDay(records);
		// Turn Map() into array of objects
		return Array.from(totals.entries()).map(([key, value]) => ({
			timestamp: parse(key, 'yyyy-MM-dd', new Date()),
			value
		}));
	}
};
