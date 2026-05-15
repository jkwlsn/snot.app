import { addHours } from 'date-fns';
import { SvelteDate } from 'svelte/reactivity';
import { OPENMETEO_CONFIG } from './providers/config';
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
	const supportedPollenTypes = service.getSupportedPollenTypes();

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
			from: new SvelteDate(),
			to: new SvelteDate(addHours(new SvelteDate(), OPENMETEO_CONFIG.maxForecastDays * 24)),
			data: undefined,
			lastUpdated: null
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
				state.current.lastUpdated = new SvelteDate();
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
			return;
		}

		state.forecast.isLoading = true;
		state.forecast.error = null;
		state.forecast.location = location;

		service
			.getForecastPollen(pollen, location, state.forecast.from, state.forecast.to)
			.then((data) => {
				state.forecast.data = data;
				state.forecast.lastUpdated = new SvelteDate();
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
