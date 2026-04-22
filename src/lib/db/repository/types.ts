// Interfaces for DB repositories
import type { CreateSymptomLog, SymptomLog, Repository } from '$lib/types';

export interface SymptomRepository extends Repository<SymptomLog, CreateSymptomLog> {
	getRange(from: Date, to: Date): Promise<SymptomLog[]>;
}
