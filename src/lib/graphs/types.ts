// Temporal graph interfaces
import type { SymptomName } from '$lib/config';
import type { SymptomRecord } from '$lib/types';

export interface TemporalDataPoint {
	timestamp: Date;
	value: number;
}

export interface TemporalGraph {
	transform(records: SymptomRecord[]): TemporalDataPoint[];
}

// Stacked bar graph data
export type StackedBarDataPoint = {
	timestamp: Date;
} & Record<SymptomName, number>;

export interface StackedBarGraph {
	transform(records: SymptomRecord[]): StackedBarDataPoint[];
}

// Radar graph data
export interface RadarDataPoint {
	label: string;
	value: number;
}

export interface RadarGraph {
	transform(records: SymptomRecord[]): RadarDataPoint[];
}

// Bar graph data
export interface LabelledDataPoint {
	label: string;
	value: number;
}

export interface BarGraph {
	transform(records: SymptomRecord[]): LabelledDataPoint[];
}
