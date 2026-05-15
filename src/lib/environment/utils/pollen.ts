import { POLLEN_SEVERITY, POLLENS } from '../config';
import type { PollenInstant, PollenMetric, PollenSeverity, PollenType } from '../types';

export function getPollenName(id: PollenType): string {
	return POLLENS.find((p) => p.id === id)?.name ?? id;
}

export function calculateSeverity(value: number): PollenSeverity {
	return POLLEN_SEVERITY.find((s) => value >= s.min)?.name ?? 'None';
}

export function aggregateInstants(instants: PollenInstant[], createdAt: Date): PollenInstant {
	const stats = new Map<PollenType, { sum: number; count: number; unit: PollenMetric['unit'] }>();

	for (let i = 0; i < instants.length; i++) {
		const metrics = instants[i].metrics;
		for (let j = 0; j < metrics.length; j++) {
			const m = metrics[j];
			let s = stats.get(m.type);
			if (!s) {
				s = { sum: 0, count: 0, unit: m.unit };
				stats.set(m.type, s);
			}
			s.sum += m.value;
			s.count += 1;
		}
	}

	const metrics: PollenMetric[] = [];
	for (const [type, { sum, count, unit }] of stats) {
		const value = sum / count;
		metrics.push({
			type,
			value,
			unit,
			severity: calculateSeverity(value)
		});
	}

	return { createdAt, metrics };
}
