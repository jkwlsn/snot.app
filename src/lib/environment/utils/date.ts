import { addHours } from 'date-fns';
import { OPENMETEO_CONFIG } from '../providers/config';

export function clampForecastDateRange(from: Date, to: Date) {
	const now = new Date();
	const maxDate = addHours(now, OPENMETEO_CONFIG.maxForecastDays * 24);

	// Enforce NOW < FROM < TO < MAX
	let clampedFrom = from < now ? addHours(now, 1) : from;
	if (clampedFrom >= maxDate) clampedFrom = addHours(maxDate, -1);

	let clampedTo = to > maxDate ? maxDate : to;
	if (clampedTo <= clampedFrom) clampedTo = addHours(clampedFrom, 1);

	return { from: clampedFrom, to: clampedTo };
}
