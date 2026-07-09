import { millisecondsInSecond } from 'date-fns/constants';
import { OPENMETEO_CONFIG } from './config';
import { toUTCDate, addSecondsUTC } from '$lib/date';
import type {
	EnvironmentObservation,
	EnvironmentObservationSeries,
	EnvironmentTransformer,
	PollenMeasurement,
	PollenType,
	PollenUnit
} from '../types';
import type { OpenMeteoProviderResponse } from './types';
import type { Unit } from '@openmeteo/sdk/unit';
import type { LocationCoordinates } from '$lib/location';

function mapUnit(unitCode: Unit | string | undefined): PollenUnit {
	return typeof unitCode === 'number'
		? (OPENMETEO_CONFIG.unitMap[unitCode] ?? 'grains_m3')
		: 'grains_m3';
}

function transformPollenMetric(
	type: PollenType,
	value: number | null | undefined,
	unitCode: Unit | string | undefined
): PollenMeasurement | null {
	if (value == null) {
		return null;
	}

	return {
		type,
		value,
		unit: mapUnit(unitCode)
	};
}

function getLocation(data: OpenMeteoProviderResponse): LocationCoordinates {
	return {
		latitude: data.raw.latitude(),
		longitude: data.raw.longitude()
	};
}

function getTimezone(data: OpenMeteoProviderResponse): string {
	return data.raw.timezone() ?? 'UTC';
}

export function createOpenmeteoTransformer(): EnvironmentTransformer<OpenMeteoProviderResponse> {
	return {
		toObservation(data: OpenMeteoProviderResponse): EnvironmentObservation {
			const current = data.raw.current()!;

			if (!current) {
				throw new Error('No current data available');
			}

			const createdAt = toUTCDate(Number(current.time()) * millisecondsInSecond);
			const location = getLocation(data);

			const pollen: PollenMeasurement[] = data.pollenTypes
				.map((type: PollenType, index: number) => {
					const variable = current.variables(index);
					return variable ? transformPollenMetric(type, variable.value(), variable.unit()) : null;
				})
				.filter((m): m is PollenMeasurement => m !== null);

			return {
				createdAt,
				location,
				pollen
			};
		},

		toObservationSeries(data: OpenMeteoProviderResponse): EnvironmentObservationSeries {
			const hourly = data.raw.hourly()!;

			if (!hourly) {
				throw new Error('No current data');
			}

			const startTime = toUTCDate(Number(hourly.time()) * millisecondsInSecond);
			const interval = hourly.interval();
			const location = getLocation(data);
			const timezone = getTimezone(data);

			const variables = data.pollenTypes
				.map((type, index) => {
					const variable = hourly.variables(index);

					if (!variable) {
						return null;
					}

					const values = variable?.valuesArray();

					if (!values) {
						return null;
					}

					return { type, values, unit: mapUnit(variable.unit()) };
				})
				.filter(
					(v): v is { type: PollenType; values: Float32Array; unit: PollenUnit } => v !== null
				);

			const length = variables[0]?.values.length ?? 0;

			const observations: EnvironmentObservation[] = [];

			for (let i = 0; i < length; i++) {
				const createdAt = addSecondsUTC(startTime, i * interval);
				const pollen: PollenMeasurement[] = [];

				for (const v of variables) {
					const value = v.values[i];
					if (value != null && !isNaN(value)) {
						pollen.push({ type: v.type, value, unit: v.unit });
					}
				}

				observations.push({ createdAt, location, pollen });
			}

			return { observations, timezone };
		}
	};
}
