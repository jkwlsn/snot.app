import { OPENMETEO_CONFIG } from './providers/config';
import { addHoursUTC, getUTCNow } from '$lib/date';
import { getLoggingService } from '$lib/logging';
import type { LocationState } from '$lib/location';
import type { PollenType, EnvironmentService, EnvironmentState } from './types';

export function createEnvironmentState({
	service,
	locationState,
	pollenTypes
}: {
	service: EnvironmentService;
	locationState: LocationState;
	pollenTypes?: PollenType[];
}): EnvironmentState {
	const logger = getLoggingService();
	const supportedPollenTypes = service.getSupportedPollenTypes();
	const now = getUTCNow();

	const state = $state<EnvironmentState>({
		supportedPollenTypes,
		selectedPollenTypes: pollenTypes ?? supportedPollenTypes,
		current: {
			location: null,
			isLoading: false,
			error: null,
			data: undefined,
			lastUpdated: null
		},
		forecast: {
			location: null,
			isLoading: false,
			error: null,
			from: now,
			to: addHoursUTC(now, OPENMETEO_CONFIG.maxForecastDays * 24),
			data: undefined,
			lastUpdated: null,
			timezone: undefined
		}
	});

	$effect(() => {
		const location = locationState.currentLocation;
		const pollen = state.supportedPollenTypes;

		if (!location) {
			state.current.data = undefined;
			state.current.location = null;
			state.current.lastUpdated = null;
			return;
		}

		state.current.isLoading = true;
		state.current.error = null;
		state.current.location = location;

		service
			.getCurrentPollen(pollen, location)
			.then((data) => {
				state.current.data = data;
				state.current.lastUpdated = getUTCNow();
			})
			.catch((err) => {
				state.current.error = err instanceof Error ? err : new Error(String(err));
			})
			.finally(() => {
				state.current.isLoading = false;
			});
	});

	$effect(() => {
		const location = locationState.currentLocation;
		const pollen = state.supportedPollenTypes;

		if (!location) {
			state.forecast.data = undefined;
			state.forecast.location = null;
			state.forecast.lastUpdated = null;
			state.forecast.timezone = undefined;
			return;
		}

		state.forecast.isLoading = true;
		state.forecast.error = null;
		state.forecast.location = location;

		service
			.getForecastPollen(pollen, location, state.forecast.from, state.forecast.to)
			.then((data) => {
				state.forecast.data = data;
				state.forecast.lastUpdated = getUTCNow();
				state.forecast.timezone = data.timezone;
				logger.debug('DEBUG: Fetched data from date:', {
					fromISO: data.observations[0].createdAt.toISOString(),
					timezone: data.timezone
				});
			})
			.catch((err) => {
				state.forecast.error = err instanceof Error ? err : new Error(String(err));
			})
			.finally(() => {
				state.forecast.isLoading = false;
			});
	});

	return state;
}
