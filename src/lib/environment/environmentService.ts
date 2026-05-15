import { createEnvironmentRepository } from './environmentRepository';
import { clampForecastDateRange } from './utils/date';
import type { UserLocation } from '$lib/location';
import type { LoggingService } from '$lib/logging';
import type {
	PollenType,
	EnvironmentService,
	PollenSeries,
	EnvironmentProvider,
	EnvironmentTransformer
} from './types';

export function createEnvironmentService<TResponse>({
	logger,
	provider,
	transformer
}: {
	logger: LoggingService;
	provider: EnvironmentProvider<TResponse>;
	transformer: EnvironmentTransformer<TResponse>;
}): EnvironmentService {
	const repository = createEnvironmentRepository({ logger, provider, transformer });

	function getSupportedPollenTypes(): PollenType[] {
		return repository.getSupportedPollenTypes();
	}

	async function getCurrentPollen(
		pollenTypes: PollenType[],
		location: UserLocation
	): Promise<PollenSeries> {
		return await repository.getCurrent(pollenTypes, location);
	}

	async function getForecastPollen(
		pollenTypes: PollenType[],
		location: UserLocation,
		from: Date,
		to: Date
	): Promise<PollenSeries> {
		const { from: clampedFrom, to: clampedTo } = clampForecastDateRange(from, to);
		return await repository.getForecast(pollenTypes, location, clampedFrom, clampedTo);
	}

	return { getSupportedPollenTypes, getCurrentPollen, getForecastPollen };
}
