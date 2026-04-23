// Interfaces and types for the app
import type { SymptomName } from '$lib/config';

// WithId is used to create IDs / Primary Keys
interface WithId {
	id: number;
}

interface WithLocation {
	location: UserLocation | null;
}

export type SymptomFields = Record<SymptomName, SymptomSeverity>;

// CreatedAt interface
// This provides a stable definition of time
// It should be extended by other interfaces.

export interface CreatedAt {
	createdAt: Date;
}

// Stored adds `WithId` to any given type, necessary for any logs in the DB
export type Stored<T> = T & WithId;

export type StoredId = WithId['id'];

// User-readable pollen levels
export const POLLEN_RISK_LEVELS = ['low', 'moderate', 'high', 'extreme'] as const;
export type PollenRisk = (typeof POLLEN_RISK_LEVELS)[number];

// Log the environment data for each symptom entry
export interface EnvironmentAtLog extends CreatedAt {
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
// Setting a const means I can use SEVERITY_LEVELS for validation at runtime.
export const SEVERITY_LEVELS = [0, 1, 2, 3, 4, 5] as const;
export type SymptomSeverity = (typeof SEVERITY_LEVELS)[number];

// CreateSymptomLog is the type used for DB symptom data entry
// It extends `CreatedAt` and `WithLocation`, meaning the type /must/ include `timestamp: Date` and `location: UserLocation | null`, it also adds `symptoms: SymptomFields`.
export interface CreateSymptomLog extends CreatedAt, WithLocation {
	symptoms: SymptomFields;
}

// `SymptomLog` describes the shape of data retrieved from the DB.
export type SymptomLog = Stored<CreateSymptomLog>;

// Repository Interface
export interface Repository<TInput, TOutput extends WithId> {
	add(entry: TInput): Promise<StoredId>;
	update(id: StoredId, patch: Partial<TInput>): Promise<void>;
	remove(id: StoredId): Promise<void>;
	getById(id: StoredId): Promise<TOutput | undefined>;
	getAll(): Promise<TOutput[]>;
}

// Basic K:V interface for app settings
export interface AppSettings extends WithId {
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
