import type { SYMPTOMS, SEVERITY_LEVELS } from './config';

export type SymptomName = (typeof SYMPTOMS)[number]['name'];

export type SymptomSeverity = (typeof SEVERITY_LEVELS)[number];

export type SymptomFields = Record<SymptomName, SymptomSeverity>;

export interface SymptomConfig {
	name: string;
	description: string;
}
