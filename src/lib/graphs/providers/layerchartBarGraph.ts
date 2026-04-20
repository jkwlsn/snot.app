import { SYMPTOMS } from '$lib/config';
import type { SymptomRecord } from '$lib/types';
import type { BarGraph, LabelledDataPoint } from '../types';

const averageSeverityBySymptom = (records: SymptomRecord[]): LabelledDataPoint[] => {
	return SYMPTOMS.map(({ name }) => {
		const currentSymptom = records.filter((r) => r[name] > 0);
		return {
			label: name,
			value:
				currentSymptom.length > 0
					? currentSymptom.reduce((sum, r) => sum + r[name], 0) / currentSymptom.length
					: 0
		};
	});
};

export const createLayerchartBarGraph: BarGraph = {
	transform(records: SymptomRecord[]) {
		return averageSeverityBySymptom(records);
	}
};
