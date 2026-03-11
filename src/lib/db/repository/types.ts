// Interfaces for DB repositories
import type { NewSymptomRecord, SymptomRecord } from '$lib/types';

export interface SymptomRepository {
	add(entry: NewSymptomRecord): Promise<number>;
	update(id: number, patch: Partial<SymptomRecord>): Promise<void>;
	delById(id: number): Promise<void>;
	getById(id: number): Promise<SymptomRecord | undefined>;
	getAll(): Promise<SymptomRecord[]>;
	getRange(from: Date, to: Date): Promise<SymptomRecord[]>;
}
