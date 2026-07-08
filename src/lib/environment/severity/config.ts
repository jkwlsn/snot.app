import type { PollenSeverityLevel } from './types';

export const POLLEN_SEVERITY: PollenSeverityLevel[] = [
	{ id: 1, level: 'Very High', threshold: 150, symbol: '🔴 ', description: '' },
	{ id: 2, level: 'High', threshold: 60, symbol: '🟠', description: '' },
	{ id: 3, level: 'Moderate', threshold: 30, symbol: '🟡', description: '' },
	{ id: 4, level: 'Low', threshold: 1, symbol: '🟢', description: '' },
	{ id: 5, level: 'None', threshold: 0, symbol: '⚪', description: '' }
];

export const DEFAULT_SEVERITY = POLLEN_SEVERITY[POLLEN_SEVERITY.length - 1];
