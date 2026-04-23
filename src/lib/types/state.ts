import type { UserLocation, SymptomLog } from './index';

export interface LocationState {
	currentLocation: UserLocation | null;
	searchResults: UserLocation[];
}

export interface SymptomsState {
	readonly symptoms: SymptomLog[];
	readonly todaysSymptoms: SymptomLog[];
}

export interface AppState {
	error: Error | null;
}
