import { POLLEN_UNITS, POLLENS } from '../config';
import type { PollenType, PollenUnit } from '../types';

// This Map prepares data outside of loops
export const POLLEN_LOOKUP = new Map(POLLENS.map((p) => [p.id, p]));

export const UNIT_LOOKUP = new Map(POLLEN_UNITS.map((u) => [u.id, u]));

export function getPollenName(id: PollenType): string {
	return POLLEN_LOOKUP.get(id)?.name ?? id;
}

export function getPollenUnit(id: PollenUnit): string {
	return UNIT_LOOKUP.get(id)?.name ?? id;
}
