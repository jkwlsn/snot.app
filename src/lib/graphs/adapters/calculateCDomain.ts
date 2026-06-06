import type { TemporalDataPoint } from '../types';

export function calculateCDomain(
	data: TemporalDataPoint[],
	fractions = [0.25, 0.5, 0.75],
	fallback = [2, 5, 8]
): number[] {
	if (data.length === 0) return fallback;
	const max = Math.max(...data.map((d) => d.value));
	return fractions.map((f) => Math.round(max * f));
}
