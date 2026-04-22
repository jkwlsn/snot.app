// Interfaces and types for the app
import type { SymptomName } from '$lib/config';

// Identity is used to create IDs / Primary Keys
interface Identity {
	id: number;
}

// Timestamp interface
// This provides a stable definition of time
// It should be extended by other interfaces.

export interface Timestamp {
	timestamp: Date;
}

// User-readable pollen levels
export type PollenRisk = 'low' | 'moderate' | 'high' | 'extreme';

// Log the environment data for each symptom entry
export interface EnvironmentAtLog extends Timestamp {
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
export type NewSymptomRecord = Timestamp & {
	location: UserLocation | null;
} & Record<SymptomName, SymptomSeverity>;

// The same as above, with the ID assigned by the database
// Used for retrieving and manipulating records
export interface SymptomRecord extends Identity, NewSymptomRecord {}

// Repository Interface
export interface Repository<T extends Identity, NewT> {
	add(entry: NewT): Promise<T['id']>;
	update(id: T['id'], patch: Partial<T>): Promise<void>;
	remove(id: T['id']): Promise<void>;
	getById(id: T['id']): Promise<T | undefined>;
	getAll(): Promise<T[]>;
}

// Basic K:V interface for app settings
export interface AppSettings extends Identity {
	key: string;
	value: unknown;
}

// Location Types
export interface LocationCoordinates {
	latitude: number;
	longitude: number;
}

// Describes a single location
export interface UserLocation {
	label: string;
	coordinates: LocationCoordinates;
}
