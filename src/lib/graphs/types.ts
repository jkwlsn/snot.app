import type { SymptomRecord } from '$lib/types';

export interface TemporalDataPoint {
	timestamp: Date;
	value: number;
}

export interface TemporalGraph {
	transform(rawData: SymptomRecord[]): TemporalDataPoint[];
}
