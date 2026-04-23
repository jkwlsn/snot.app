import type { SymptomLog, SymptomFields } from './symptoms';

export interface SymptomService {
	submitSymptoms(values: SymptomFields): Promise<number>;

	getAllSymptoms(): Promise<SymptomLog[]>;
	getRangeSymptoms(from: Date, to: Date): Promise<SymptomLog[]>;
	removeSymptom(id: number): Promise<void>;
}
