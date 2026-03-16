import type { UserLocation } from './types';

interface LocationState {
	currentLocation: UserLocation | null;
	searchResults: UserLocation[];
}

export const locationState = $state<LocationState>({
	currentLocation: null,
	searchResults: []
});
