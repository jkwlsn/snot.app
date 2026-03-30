import type { SymptomRecord, UserLocation } from '$lib/types';

export interface SymptomService {
	submitSymptoms(values: Record<string, number>, location: UserLocation | null): Promise<number>;
	getAllSymptoms(): Promise<SymptomRecord[]>;
	getRangeSymptoms(from: Date, to: Date): Promise<SymptomRecord[]>;
	removeSymptom(id: number): void;
}
