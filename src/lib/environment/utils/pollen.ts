import { POLLENS } from '../config';
import type { PollenType } from '../types';

export function getPollenName(id: PollenType): string {
	return POLLENS.find((p) => p.id === id)?.name ?? id;
}
