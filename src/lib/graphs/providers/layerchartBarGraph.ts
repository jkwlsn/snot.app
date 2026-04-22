import { SYMPTOMS } from '$lib/config';
import type { SymptomLog } from '$lib/types';
import type { GraphProvider, LabelledDataPoint } from '../types';

const averageSeverityBySymptom = (records: SymptomLog[]): LabelledDataPoint[] => {
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

export const createLayerchartBarGraph: GraphProvider<SymptomLog, LabelledDataPoint> = {
	transform(records) {
		return averageSeverityBySymptom(records);
	}
};
