// Interfaces and types for the app

import type { SymptomName } from '$lib/config';

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

// Describes a new entry for the database, it will be assigned an ID by the DB.
// Records timestamp and a list of symptoms (defined by SymptomName, in turn generated from SYMPTOMS constant) and severities (numbers)
export type NewSymptomRecord = { timestamp: Date } & Record<SymptomName, SymptomSeverity>;

// The same as above, with the ID assigned by the database
// Used for retrieving and manipulating records
export type SymptomRecord = NewSymptomRecord & { id: number };

// Basic K:V interface for app settings
export interface AppSettings {
	id: number;
	key: string;
	value: unknown;
}
