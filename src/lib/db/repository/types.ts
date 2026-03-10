// Interfaces for DB repositories
import type { SymptomEntry } from '$lib/types';

export interface SymptomRepository {
	add(entry: Omit<SymptomEntry, 'id'>): Promise<number>;
	update(id: number, patch: Partial<SymptomEntry>): Promise<void>;
	delById(id: number): Promise<void>;
	getById(id: number): Promise<SymptomEntry | undefined>;
	getAll(): Promise<SymptomEntry[]>;
	getRange(from: Date, to: Date): Promise<SymptomEntry[]>;
}
