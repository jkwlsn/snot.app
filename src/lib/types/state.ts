import type { UserLocation, SymptomLog } from './index';

export interface LocationState {
	currentLocation: UserLocation | null;
	searchResults: UserLocation[];
}

export interface SymptomState {
	readonly symptoms: SymptomLog[];
	readonly todaysSymptoms: SymptomLog[];
}
