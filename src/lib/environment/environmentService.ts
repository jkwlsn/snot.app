import { createEnvironmentRepository } from './environmentRepository';
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
		return await repository.getForecast(pollenTypes, location, from, to);
	}

	return { getSupportedPollenTypes, getCurrentPollen, getForecastPollen };
}
