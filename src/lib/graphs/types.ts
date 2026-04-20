// Temporal graph interfaces
import type { Timestamp, SymptomRecord } from '$lib/types';

export interface TemporalDataPoint extends Timestamp {
	value: number;
}

export interface LabelledDataPoint {
	label: string;
	value: number;
}

export interface GraphProvider<DataType> {
	transform(records: SymptomRecord[]): DataType[];
}
