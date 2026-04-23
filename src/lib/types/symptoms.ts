import type { SymptomName } from '$lib/config';
import type { CreatedAt, Stored } from './base';
import type { WithLocation } from './location';

export const SEVERITY_LEVELS = [0, 1, 2, 3, 4, 5] as const;
export type SymptomSeverity = (typeof SEVERITY_LEVELS)[number];

export type SymptomFields = Record<SymptomName, SymptomSeverity>;

export interface CreateSymptomLog extends CreatedAt, WithLocation {
	symptoms: SymptomFields;
}

export type SymptomLog = Stored<CreateSymptomLog>;
