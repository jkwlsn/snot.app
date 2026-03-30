import type { UserLocation } from '$lib/types';

interface LocationState {
	currentLocation: UserLocation | null;
	searchResults: UserLocation[];
}

export const locationState = $state<LocationState>({
	currentLocation: null,
	searchResults: []
});
