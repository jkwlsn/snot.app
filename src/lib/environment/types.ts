import type { CreatedAt } from '$lib/types';
import type { LocationCoordinates, UserLocation, WithLocation } from '$lib/location';
import type { POLLEN_UNITS, POLLENS } from './config';
import type { UTCDate } from '$lib/date';

export type PollenType = (typeof POLLENS)[number]['id'];

export type PollenUnit = (typeof POLLEN_UNITS)[number]['id'];

export interface PollenMeasurement {
	type: PollenType;
	value: number;
	unit: PollenUnit;
}

export interface EnvironmentObservation extends CreatedAt {
	location: LocationCoordinates;
	pollen: PollenMeasurement[];
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
	toObservation(data: EnvironmentProviderResponse): EnvironmentObservation;
	toObservationSeries(data: EnvironmentProviderResponse): EnvironmentObservation[];
}

export interface EnvironmentRepository {
	getSupportedPollenTypes(): PollenType[];
	getCurrent(pollenTypes: PollenType[], location: UserLocation): Promise<EnvironmentObservation>;
	getForecast(
		pollenTypes: PollenType[],
		location: UserLocation,
		from: UTCDate,
		to: UTCDate
	): Promise<EnvironmentObservation[]>;
}

export interface EnvironmentService {
	getSupportedPollenTypes(): PollenType[];
	getCurrentPollen(
		pollenTypes: PollenType[],
		location: UserLocation
	): Promise<EnvironmentObservation>;
	getForecastPollen(
		pollenTypes: PollenType[],
		location: UserLocation,
		from: UTCDate,
		to: UTCDate
	): Promise<EnvironmentObservation[]>;
}

export interface CurrentPollenState extends WithLocation {
	error: Error | null;
	isLoading: boolean;
	data: EnvironmentObservation | undefined;
	lastUpdated: UTCDate | null;
	timezone: string | undefined;
}

export interface ForecastPollenState extends WithLocation {
	error: Error | null;
	isLoading: boolean;
	from: UTCDate;
	to: UTCDate;
	data: EnvironmentObservation[] | undefined;
	lastUpdated: UTCDate | null;
	timezone: string | undefined;
}

export interface EnvironmentState {
	readonly supportedPollenTypes: PollenType[];
	selectedPollenTypes: PollenType[];
	forecast: ForecastPollenState;
	current: CurrentPollenState;
}
