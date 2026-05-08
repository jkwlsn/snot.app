import { handleError } from '$lib/errors';
import type { UserLocation } from '$lib/location';
import type { LoggingService } from '$lib/logging';
import type {
	PollenType,
	EnvironmentRepository,
	PollenSeries,
	EnvironmentProvider,
	EnvironmentTransformer
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
	): Promise<PollenSeries> {
		try {
			const data = await provider.getCurrent(pollenTypes, location);
			const series = transformer.toInstant(data, location);
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
		from: Date,
		to: Date
	): Promise<PollenSeries> {
		try {
			const data = await provider.getForecast(pollenTypes, location, from, to);
			const series = transformer.toSeries(data, location);
			logger.info('Successfully fetched pollen forecast data', {
				pollenTypes,
				location,
				from,
				to,
				instantsCount: series.instants.length
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
