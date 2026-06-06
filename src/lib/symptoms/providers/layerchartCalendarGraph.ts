import { parse } from 'date-fns/parse';
import { toDayKey, type UTCDate } from '$lib/date';
import type { SymptomLog } from '../types';
import type { TemporalDataPoint, GraphProvider } from '$lib/graphs';

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
		// Use the viewer's local timezone since we are creating local Date objects
		const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

		return Array.from(totals.entries()).map(([key, value]) => ({
			// We parse into a local Date object because the LayerChart Calendar
			// component matches cells based on local-time day boundaries.
			// We cast to UTCDate to satisfy the TemporalDataPoint interface.
			createdAt: parse(key, 'yyyy-MM-dd', new Date()) as unknown as UTCDate,
			timezone: localTimezone,
			value
		}));
	}
};
