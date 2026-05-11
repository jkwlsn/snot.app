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

export interface EnvironmentTransformer<EnvironmentProviderResponse> {
	toInstant(data: EnvironmentProviderResponse, location: UserLocation): PollenSeries;
	toSeries(data: EnvironmentProviderResponse, location: UserLocation): PollenSeries;
}

export interface EnvironmentRepository {
	getSupportedPollenTypes(): PollenType[];
	getCurrent(pollenTypes: PollenType[], location: UserLocation): Promise<PollenSeries>;
	getForecast(
		pollenTypes: PollenType[],
		location: UserLocation,
		from: Date,
		to: Date
	): Promise<PollenSeries>;
}

export interface EnvironmentService {
	getSupportedPollenTypes(): PollenType[];
	getCurrentPollen(pollenTypes: PollenType[], location: UserLocation): Promise<PollenSeries>;
	getForecastPollen(
		pollenTypes: PollenType[],
		location: UserLocation,
		from: Date,
		to: Date
	): Promise<PollenSeries>;
}

export interface CurrentPollenState extends WithLocation {
	error: Error | null;
	isLoading: boolean;
	data: PollenSeries | undefined;
	lastUpdated: Date | null;
}

export interface ForecastPollenState extends WithLocation {
	error: Error | null;
	isLoading: boolean;
	from: Date;
	to: Date;
	data: PollenSeries | undefined;
	lastUpdated: Date | null;
}

export interface EnvironmentState {
	readonly supportedPollenTypes: PollenType[];
	selectedPollenTypes: PollenType[];
	forecast: ForecastPollenState;
	current: CurrentPollenState;
}
