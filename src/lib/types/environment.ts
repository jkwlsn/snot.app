import type { CreatedAt } from './base';

export const POLLEN_RISK_LEVELS = ['low', 'moderate', 'high', 'extreme'] as const;
export type PollenRisk = (typeof POLLEN_RISK_LEVELS)[number];

export interface EnvironmentAtLog extends CreatedAt {
	source: string;
	pollenGrass: number | null;
	pollenTree: number | null;
	pollenWeed: number | null;
	temperature: number | null;
	humidity: number | null;
	windSpeed: number | null;
	pollenRiskTotal: PollenRisk;
}
