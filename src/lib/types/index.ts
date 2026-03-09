// Interfaces and types for the app

// Used for location data
export interface LatLong {
	lat: number;
	long: number;
}

// Describes where teh value came from, web location or manual
export type LocationSource = 'gps' | 'manual';

export interface ResolvedLocation extends LatLong {
	label: string;
	source: LocationSource;
}

// User-readable pollen levels
export type PollenRisk = 'low' | 'moderate' | 'high' | 'extreme';

// Log the environment data for each symptom entry
export interface EnvironmentAtLog {
	timestamp: Date;
	source: string;
	pollenGrass: number | null;
	pollenTree: number | null;
	pollenWeed: number | null;
	temperature: number | null;
	humidity: number | null;
	windSpeed: number | null;
	pollenRiskTotal: PollenRisk;
}

// Symptoms can be rated between 0-5 in severity
export type SymptomSeverity = 0 | 1 | 2 | 3 | 4 | 5;

// Describes an entry in the symptom log
// Describes timestamp, location, location name, areas affected and severity, and a snapshot of the environment at the moment of logging.
export interface SymptomEntry {
	id: number;
	timestamp: Date;
	eyes: SymptomSeverity;
	nose: SymptomSeverity;
	throat: SymptomSeverity;
	breathing: SymptomSeverity;
	//	location: LatLong;
	//	locationLabel: string;
	//	environment: EnvironmentAtLog | null;
}

// Basic K:V interface for app settings
export interface AppSettings {
	id: number;
	key: string;
	value: unknown;
}
