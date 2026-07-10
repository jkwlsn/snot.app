import type { PollenSeverityLevel } from './types';

export const POLLEN_SEVERITY: PollenSeverityLevel[] = [
	{ id: 5, level: 'Very High', threshold: 150, symbol: '🔴 ', description: '' },
	{ id: 4, level: 'High', threshold: 60, symbol: '🟠', description: '' },
	{ id: 3, level: 'Moderate', threshold: 30, symbol: '🟡', description: '' },
	{ id: 2, level: 'Low', threshold: 1, symbol: '🟢', description: '' },
	{ id: 1, level: 'None', threshold: 0, symbol: '⚪', description: '' }
];

export const MAX_SEVERITY = POLLEN_SEVERITY[0]['id'];

export const MIN_SEVERITY = POLLEN_SEVERITY[POLLEN_SEVERITY.length - 1]['id'];

export const DEFAULT_SEVERITY = MIN_SEVERITY;
