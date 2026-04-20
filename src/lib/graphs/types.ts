// Temporal graph interfaces
import type { SymptomRecord } from '$lib/types';

export interface TemporalDataPoint {
	timestamp: Date;
	value: number;
}

export interface TemporalGraph {
	transform(records: SymptomRecord[]): TemporalDataPoint[];
}

// Bar graph data
export interface LabelledDataPoint {
	label: string;
	value: number;
}

export interface BarGraph {
	transform(records: SymptomRecord[]): LabelledDataPoint[];
}
