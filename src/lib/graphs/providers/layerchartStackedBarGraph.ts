import { format, startOfDay } from 'date-fns';
import { SYMPTOMS, type SymptomName } from '$lib/config';
import type { SymptomRecord } from '$lib/types';
import type { StackedBarDataPoint, StackedBarGraph } from '../types';

const toKey = (timestamp: Date) => format(startOfDay(new Date(timestamp)), 'yyyy-MM-dd');

const emptyValues = (): Record<SymptomName, number> =>
	Object.fromEntries(SYMPTOMS.map((symptom) => [symptom.name, 0])) as Record<SymptomName, number>;

const aggregateSymptomsByDay = (records: SymptomRecord[]) => {
	const byDay = new Map<string, { values: Record<SymptomName, number>; count: number }>();

	for (const record of records) {
		const key = toKey(record.timestamp);
		const entry = byDay.get(key) ?? { values: emptyValues(), count: 0 };

		for (const symptom of SYMPTOMS) {
			entry.values[symptom.name as SymptomName] += record[symptom.name as SymptomName];
		}

		entry.count += 1;
		byDay.set(key, entry);
	}

	return byDay;
};

export const createLayerchartStackedBarGraph: StackedBarGraph = {
	transform(records: SymptomRecord[]): StackedBarDataPoint[] {
		const byDay = aggregateSymptomsByDay(records);

		return Array.from(byDay.entries()).map(([key, { values, count }]) => ({
			timestamp: new Date(key),
			...(Object.fromEntries(
				SYMPTOMS.map((symptom) => [symptom.name, values[symptom.name as SymptomName] / count])
			) as Record<SymptomName, number>)
		}));
	}
};
