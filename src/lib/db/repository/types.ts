// Interfaces for DB repositories
import type { NewSymptomRecord, SymptomRecord, Repository } from '$lib/types';

export interface SymptomRepository extends Repository<SymptomRecord, NewSymptomRecord> {
	getRange(from: Date, to: Date): Promise<SymptomRecord[]>;
}
