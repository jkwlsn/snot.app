import type { UserLocation } from './index';

export interface LocationState {
	currentLocation: UserLocation | null;
	searchResults: UserLocation[];
}
