import type { LocationState } from './types';

export const locationState = $state<LocationState>({
	currentLocation: null,
	searchResults: []
});
