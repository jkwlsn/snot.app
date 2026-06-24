import { SYMPTOMS } from '$lib/symptoms';
import type { GraphProvider, LabelledDataPoint } from '$lib/types';
import type { Entry } from '$lib/entries';

const averageSeverityBySymptom = (records: Entry[]): LabelledDataPoint[] => {
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

export const createLayerchartBarGraph: GraphProvider<Entry, LabelledDataPoint> = {
	transform(records) {
		return averageSeverityBySymptom(records);
	}
};
