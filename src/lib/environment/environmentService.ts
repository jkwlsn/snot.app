import { createEnvironmentRepository } from './environmentRepository';
import { clampForecastDateRange } from './utils/date';
import type { UserLocation } from '$lib/location';
import type { LoggingService } from '$lib/logging';
import type {
	PollenType,
	EnvironmentService,
	EnvironmentProvider,
	EnvironmentTransformer,
	CurrentEnvironment,
	ForecastEnvironment
} from './types';
import type { UTCDate } from '@date-fns/utc';

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
	): Promise<CurrentEnvironment> {
		return await repository.getCurrent(pollenTypes, location);
	}

	async function getForecastPollen(
		pollenTypes: PollenType[],
		location: UserLocation,
		from: UTCDate,
		to: UTCDate
	): Promise<ForecastEnvironment> {
		const { from: clampedFrom, to: clampedTo } = clampForecastDateRange(from, to);
		const { observations, timezone } = await repository.getForecast(
			pollenTypes,
			location,
			clampedFrom,
			clampedTo
		);
		return { observations, timezone };
	}

	return { getSupportedPollenTypes, getCurrentPollen, getForecastPollen };
}
