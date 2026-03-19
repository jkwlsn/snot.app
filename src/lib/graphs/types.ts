// Temporal graph interfaces
import type { SymptomName } from '$lib/config';
import type { LocationCoordinates } from '$lib/location/types';
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

// Geo graph interfaces
export type GeoDataPoint = LocationCoordinates & {
	value: number;
	count: number;
};

export interface GeoGraph {
	transform(records: SymptomRecord[]): GeoDataPoint[];
}
