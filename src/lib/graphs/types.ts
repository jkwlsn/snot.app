import type { Timestamp } from '$lib/types';

// DataPoint describes a single point of data
interface DataPoint {
	value: number;
}

// DataPoint is extended to create rich data types

// LabelledDataPoint adds a label (for bar graphs, etc.)
export interface LabelledDataPoint extends DataPoint {
	label: string;
}

// TemporalDataPoint adds a timestamp (for line graphs etc.)
export interface TemporalDataPoint extends Timestamp, DataPoint {}

// GraphProvider describes the interface for graphs
export interface GraphProvider<TIn, TOut> {
	transform(records: TIn[]): TOut[];
}
