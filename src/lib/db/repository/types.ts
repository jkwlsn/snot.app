// Interfaces for DB repositories
import type { CreateSymptomRecord, SymptomRecord, Repository } from '$lib/types';

export interface SymptomRepository extends Repository<SymptomRecord, CreateSymptomRecord> {
	getRange(from: Date, to: Date): Promise<SymptomRecord[]>;
}
