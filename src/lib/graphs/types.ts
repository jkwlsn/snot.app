import type { Timestamp } from '$lib/types';

// Temporal graph interfaces
export interface TemporalDataPoint extends Timestamp {
	value: number;
}

export interface LabelledDataPoint {
	label: string;
	value: number;
}

export interface GraphProvider<TIn, TOut> {
	transform(records: TIn[]): TOut[];
}
