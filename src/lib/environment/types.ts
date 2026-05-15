import type { CreatedAt } from '$lib/types';
import type { UserLocation, WithLocation } from '$lib/location';
import type { POLLEN_UNITS, POLLENS, POLLEN_SEVERITY } from './config';

export type PollenType = (typeof POLLENS)[number]['id'];

export type PollenUnit = (typeof POLLEN_UNITS)[number]['id'];

export type PollenSeverity = (typeof POLLEN_SEVERITY)[number]['name'];

export interface PollenMetric {
	type: PollenType;
	value: number;
	unit: PollenUnit;
	severity: PollenSeverity;
}

export interface PollenMeasurement extends CreatedAt {
	metric: PollenMetric;
}

export interface PollenInstant extends CreatedAt {
	metrics: PollenMetric[];
}

export interface PollenSeries extends CreatedAt, WithLocation {
	pollenTypes: PollenType[];
	instants: PollenInstant[];
}

export interface EnvironmentProvider<EnvironmentProviderResponse> {
	readonly supportedPollens: PollenType[];
	getCurrent(
		pollenTypes: PollenType[],
		location: UserLocation
	): Promise<EnvironmentProviderResponse>;
	getForecast(
		pollenTypes: PollenType[],
		location: UserLocation,
		from: Date,
		to: Date
	): Promise<EnvironmentProviderResponse>;
}
