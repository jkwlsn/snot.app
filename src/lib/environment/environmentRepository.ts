import { handleError } from '$lib/errors';
import type { UserLocation } from '$lib/location';
import type { LoggingService } from '$lib/logging';
import type { UTCDate } from '$lib/date';
import type {
	PollenType,
	EnvironmentRepository,
	EnvironmentProvider,
	EnvironmentTransformer,
	CurrentEnvironment,
	ForecastEnvironment
} from './types';

export function createEnvironmentRepository<TResponse>({
	logger,
	provider,
	transformer
}: {
	logger: LoggingService;
	provider: EnvironmentProvider<TResponse>;
	transformer: EnvironmentTransformer<TResponse>;
}): EnvironmentRepository {
	function getSupportedPollenTypes(): PollenType[] {
		return provider.supportedPollens;
	}

	async function getCurrent(
		pollenTypes: PollenType[],
		location: UserLocation
	): Promise<CurrentEnvironment> {
		try {
			const data = await provider.getCurrent(pollenTypes, location);
			const series = transformer.toObservation(data);
			logger.info('Successfully fetched current pollen data', { pollenTypes, location, series });
			return series;
		} catch (err) {
			throw handleError({
				error: err,
				operation: 'getCurrent',
				logger,
				context: { pollenTypes, location }
			});
		}
	}

	async function getForecast(
		pollenTypes: PollenType[],
		location: UserLocation,
		from: UTCDate,
		to: UTCDate
	): Promise<ForecastEnvironment> {
		try {
			const data = await provider.getForecast(pollenTypes, location, from, to);
			const series = transformer.toObservationSeries(data);
			logger.info('Successfully fetched pollen forecast data', {
				pollenTypes,
				location,
				from: from.toISOString(),
				to: to.toISOString(),
				observationsCount: series.observations.length
			});
			return series;
		} catch (err) {
			throw handleError({
				error: err,
				operation: 'getForecast',
				logger,
				context: { pollenTypes, location, from: from.toISOString(), to: to.toISOString() }
			});
		}
	}

	return { getSupportedPollenTypes, getCurrent, getForecast };
}
