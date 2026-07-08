import { millisecondsInSecond } from 'date-fns/constants';
import { OPENMETEO_CONFIG } from './config';
import { toUTCDate, addSecondsUTC, getUTCNow } from '$lib/date';
import type {
	EnvironmentTransformer,
	PollenInstant,
	PollenMetric,
	PollenSeries,
	PollenType,
	PollenUnit
} from '../types';
import type { Unit } from '@openmeteo/sdk/unit';
import type { OpenMeteoProviderResponse } from './types';
import type { UserLocation } from '$lib/location';

function mapUnit(unitCode: Unit | string | undefined): PollenUnit {
	return (typeof unitCode === 'number' ? OPENMETEO_CONFIG.unitMap[unitCode] : null) ?? 'grains_m3';
}

function transformMetric(
	id: PollenType,
	value: number | null | undefined,
	unitCode: Unit | string | undefined
): PollenMetric | null {
	if (value == null) return null;

	return {
		type: id,
		value,
		unit: mapUnit(unitCode)
	};
}

export function createOpenmeteoTransformer(): EnvironmentTransformer<OpenMeteoProviderResponse> {
	return {
		toInstant(data: OpenMeteoProviderResponse, location: UserLocation): PollenSeries {
			if (data.raw.current() == null) throw new Error('No current data');

			const { raw, pollenTypes } = data;
			const current = raw.current()!;
			const createdAt = toUTCDate(Number(current.time()) * millisecondsInSecond);
			const timezone = raw.timezone() ?? 'UTC';

			const metrics = pollenTypes
				.map((type: PollenType, index: number) => {
					const variable = current.variables(index);
					return variable ? transformMetric(type, variable.value(), variable.unit()) : null;
				})
				.filter((m): m is PollenMetric => m !== null);

			return {
				createdAt,
				location,
				pollenTypes: metrics.map((m: PollenMetric) => m.type),
				instants: [{ createdAt, timezone, metrics }],
				timezone
			};
		},

		toSeries(data: OpenMeteoProviderResponse, location: UserLocation): PollenSeries {
			if (data.raw.hourly() == null) throw new Error('No current data');

			const { raw, pollenTypes } = data;
			const hourly = raw.hourly()!;
			const startTime = toUTCDate(Number(hourly.time()) * millisecondsInSecond);
			const interval = hourly.interval();
			const timezone = raw.timezone() ?? 'UTC';

			const variables = pollenTypes
				.map((type: PollenType, index: number) => {
					const variable = hourly.variables(index);
					const values = variable?.valuesArray();

					if (!variable || !values) return null;

					return { type, values, unit: mapUnit(variable.unit()) };
				})
				.filter(
					(v): v is { type: PollenType; values: Float32Array; unit: PollenUnit } => v !== null
				);

			const length = variables[0]?.values.length ?? 0;

			const instants: PollenInstant[] = new Array(length);

			for (let i = 0; i < length; i++) {
				const createdAt = addSecondsUTC(startTime, i * interval);
				const metrics: PollenMetric[] = [];

				for (const v of variables) {
					const value = v.values[i];
					if (value != null && !isNaN(value)) {
						metrics.push({ type: v.type, value, unit: v.unit });
					}
				}

				instants[i] = { createdAt, timezone, metrics };
			}

			return {
				createdAt: instants[0]?.createdAt ?? getUTCNow(),
				location,
				pollenTypes: variables.map((v) => v.type),
				instants,
				timezone
			};
		}
	};
}
