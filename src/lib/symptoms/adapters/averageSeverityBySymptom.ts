import { SYMPTOMS } from '../config';
import type { SymptomLog } from '../types';
import type { LabelledDataPoint } from '$lib/graphs';

export const averageSeverityBySymptom = (records: SymptomLog[]): LabelledDataPoint[] => {
	return SYMPTOMS.map(({ name }) => {
		const currentSymptom = records.filter((r) => r.symptoms[name] > 0);
		return {
			label: name,
			value:
				currentSymptom.length > 0
					? currentSymptom.reduce((sum, r) => sum + r.symptoms[name], 0) / currentSymptom.length
					: 0
		};
	});
};
