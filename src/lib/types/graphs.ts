import type { CreatedAt } from './base';

interface DataPoint {
	value: number;
}

export interface LabelledDataPoint extends DataPoint {
	label: string;
}

export interface TemporalDataPoint extends CreatedAt, DataPoint {}

export interface GraphProvider<TIn, TOut> {
	transform(records: TIn[]): TOut[];
}
