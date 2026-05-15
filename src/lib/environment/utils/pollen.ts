import { POLLEN_SEVERITY, POLLENS } from '../config';
import type { PollenSeverity, PollenType } from '../types';

export function getPollenName(id: PollenType): string {
	return POLLENS.find((p) => p.id === id)?.name ?? id;
}

export function calculateSeverity(value: number): PollenSeverity {
	return POLLEN_SEVERITY.find((s) => value >= s.min)?.name ?? 'None';
}
