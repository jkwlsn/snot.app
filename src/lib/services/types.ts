import type { SymptomFields, SymptomLog, UserLocation } from '$lib/types';

export interface SymptomService {
	submitSymptoms(values: SymptomFields, location: UserLocation | null): Promise<number>;
	getAllSymptoms(): Promise<SymptomLog[]>;
	getRangeSymptoms(from: Date, to: Date): Promise<SymptomLog[]>;
	removeSymptom(id: number): Promise<void>;
}
