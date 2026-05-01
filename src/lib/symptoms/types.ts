import type { WithLocation } from '$lib/location';
import type { CreatedAt, Stored, Repository } from '$lib/types';
import type { SYMPTOMS, SEVERITY_LEVELS } from './config';

export type SymptomName = (typeof SYMPTOMS)[number]['name'];

export type SymptomSeverity = (typeof SEVERITY_LEVELS)[number];

export type SymptomFields = Record<SymptomName, SymptomSeverity>;

export interface SymptomConfig {
	name: string;
	description: string;
}

export interface CreateSymptomLog extends CreatedAt, WithLocation {
	symptoms: SymptomFields;
}

export type SymptomLog = Stored<CreateSymptomLog>;

export interface SymptomRepository extends Repository<CreateSymptomLog, SymptomLog> {
	getRange(from: Date, to: Date): Promise<SymptomLog[]>;
}

export interface SymptomService {
	submitSymptoms(values: SymptomFields): Promise<number>;
	getAllSymptoms(): Promise<SymptomLog[]>;
	getRangeSymptoms(from: Date, to: Date): Promise<SymptomLog[]>;
	removeSymptom(id: number): Promise<void>;
}

export interface SymptomState {
	readonly symptoms: SymptomLog[];
	readonly todaysSymptoms: SymptomLog[];
}
