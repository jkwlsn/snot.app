import type { CreatedAt } from '$lib/types';
import type { UserLocation, WithLocation } from '$lib/location';
import type { POLLEN_UNITS, POLLENS, POLLEN_SEVERITY } from './config';
import type { UTCDate } from '$lib/date';

export type PollenType = (typeof POLLENS)[number]['id'];

export type PollenUnit = (typeof POLLEN_UNITS)[number]['id'];

export type PollenSeverityNumber = (typeof POLLEN_SEVERITY)[number];

export type PollenSeverityName = PollenSeverityNumber['name'];

export interface PollenMetric {
	type: PollenType;
	value: number;
	unit: PollenUnit;
	severity: PollenSeverityNumber;
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
	timezone: string;
}

export interface SeverityData {
	name: string;
	severityName: string;
	symbol: string;
	value: number;
	unit: string;
	description: string;
}

export interface SeverityInstant {
	severityInstant: SeverityData[];
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
		from: UTCDate,
		to: UTCDate
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
		from: UTCDate,
		to: UTCDate
	): Promise<PollenSeries>;
}

export interface EnvironmentService {
	getSupportedPollenTypes(): PollenType[];
	getCurrentPollen(pollenTypes: PollenType[], location: UserLocation): Promise<PollenSeries>;
	getForecastPollen(
		pollenTypes: PollenType[],
		location: UserLocation,
		from: UTCDate,
		to: UTCDate
	): Promise<PollenSeries>;
}

export interface CurrentPollenState extends WithLocation {
	error: Error | null;
	isLoading: boolean;
	data: PollenSeries | undefined;
	lastUpdated: UTCDate | null;
}

export interface ForecastPollenState extends WithLocation {
	error: Error | null;
	isLoading: boolean;
	from: UTCDate;
	to: UTCDate;
	data: PollenSeries | undefined;
	lastUpdated: UTCDate | null;
	timezone: string;
}

export interface EnvironmentState {
	readonly supportedPollenTypes: PollenType[];
	selectedPollenTypes: PollenType[];
	forecast: ForecastPollenState;
	current: CurrentPollenState;
}
