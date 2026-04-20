// Temporal graph interfaces
import type { SymptomRecord } from '$lib/types';

export interface TemporalDataPoint {
	timestamp: Date;
	value: number;
}

export interface LabelledDataPoint {
	label: string;
	value: number;
}

export interface GraphProvider<DataType> {
	transform(records: SymptomRecord[]): DataType[];
}
