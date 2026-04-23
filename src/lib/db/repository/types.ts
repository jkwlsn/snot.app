// Interfaces for DB repositories
import type { CreateSymptomLog, SymptomLog, Repository } from '$lib/types';

export interface SymptomRepository extends Repository<CreateSymptomLog, SymptomLog> {
	getRange(from: Date, to: Date): Promise<SymptomLog[]>;
}
