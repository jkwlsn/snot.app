import type { CreatedAt, WithTimezone } from "$lib/types";
import type { LocationCoordinates, UserLocation, WithLocation } from "$lib/location";
import type { POLLEN_UNITS, POLLEN_IDS } from "./config";
import type { UTCDate } from "$lib/date";

export type PollenType = (typeof POLLEN_IDS)[number];

export type PollenUnit = (typeof POLLEN_UNITS)[number]["id"];

export interface PollenMeasurement {
  type: PollenType;
  value: number;
  unit: PollenUnit;
}

export interface EnvironmentObservation extends CreatedAt {
  location: LocationCoordinates;
  pollen: PollenMeasurement[];
}

export interface EnvironmentObservationSeries extends WithTimezone {
  observations: EnvironmentObservation[];
}

// Current pollen
export type CurrentEnvironment = EnvironmentObservation;

// Forecast: a series that carries one timezone for the whole batch
export type ForecastEnvironment = EnvironmentObservationSeries;

export interface EnvironmentProvider<EnvironmentProviderResponse> {
  readonly supportedPollens: PollenType[];
  getCurrent(
    pollenTypes: PollenType[],
    location: UserLocation,
  ): Promise<EnvironmentProviderResponse>;
  getForecast(
    pollenTypes: PollenType[],
    location: UserLocation,
    from: UTCDate,
    to: UTCDate,
  ): Promise<EnvironmentProviderResponse>;
}

export interface EnvironmentTransformer<EnvironmentProviderResponse> {
  toObservation(data: EnvironmentProviderResponse): CurrentEnvironment;
  toObservationSeries(data: EnvironmentProviderResponse): ForecastEnvironment;
}

export interface EnvironmentRepository {
  getSupportedPollenTypes(): PollenType[];
  getCurrent(pollenTypes: PollenType[], location: UserLocation): Promise<CurrentEnvironment>;
  getForecast(
    pollenTypes: PollenType[],
    location: UserLocation,
    from: UTCDate,
    to: UTCDate,
  ): Promise<ForecastEnvironment>;
}

export interface EnvironmentService {
  getSupportedPollenTypes(): PollenType[];
  getCurrentPollen(pollenTypes: PollenType[], location: UserLocation): Promise<CurrentEnvironment>;
  getForecastPollen(
    pollenTypes: PollenType[],
    location: UserLocation,
    from: UTCDate,
    to: UTCDate,
  ): Promise<ForecastEnvironment>;
}

export interface CurrentPollenState extends WithLocation {
  readonly error: Error | null;
  readonly isLoading: boolean;
  readonly data: CurrentEnvironment | undefined;
  readonly lastUpdated: UTCDate | null;
}

export interface ForecastPollenState extends WithLocation {
  readonly error: Error | null;
  readonly isLoading: boolean;
  readonly from: UTCDate;
  readonly to: UTCDate;
  readonly data: ForecastEnvironment | undefined;
  readonly lastUpdated: UTCDate | null;
  readonly timezone: string | undefined;
}

export interface EnvironmentState {
  readonly supportedPollenTypes: PollenType[];
  readonly selectedPollenTypes: PollenType[];
  readonly forecast: ForecastPollenState;
  readonly current: CurrentPollenState;
  setSelectedPollenTypes(types: PollenType[]): void;
  togglePollenType(pollenId: PollenType): void;
  setForecastRange(from: UTCDate, to: UTCDate): void;
}
