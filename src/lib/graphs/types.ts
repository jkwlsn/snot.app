import type { CreatedAt } from '$lib/types';
import type { UTCDate } from '@date-fns/utc';

interface DataPoint {
	value: number;
}

export interface LabelledDataPoint extends DataPoint {
	label: string;
}

export interface TemporalDataPoint extends CreatedAt, DataPoint {}

export type MultiSeriesDataPoint = Record<string, number | UTCDate> & { createdAt: UTCDate };

export interface GraphProvider<TIn, TOut> {
	transform(records: TIn[]): TOut[];
}
