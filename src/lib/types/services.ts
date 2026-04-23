import type { SymptomLog, SymptomFields } from './symptoms';
import type { UserLocation } from './location';

export interface SymptomService {
	submitSymptoms(values: SymptomFields, location: UserLocation | null): Promise<number>;

	getAllSymptoms(): Promise<SymptomLog[]>;
	getRangeSymptoms(from: Date, to: Date): Promise<SymptomLog[]>;
	removeSymptom(id: number): Promise<void>;
}
