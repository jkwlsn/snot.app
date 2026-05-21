import { isAfter, isBefore } from 'date-fns';
import { OPENMETEO_CONFIG } from '../providers/config';
import { addHoursUTC, getUTCNow, type UTCDate } from '$lib/date';

export function clampForecastDateRange(from: UTCDate, to: UTCDate) {
	const now = getUTCNow();
	const maxDate = addHoursUTC(now, OPENMETEO_CONFIG.maxForecastDays * 24);

	// Enforce NOW < FROM < TO < MAX
	let clampedFrom = isBefore(from, now) ? addHoursUTC(now, 1) : from;
	if (!isBefore(clampedFrom, maxDate)) clampedFrom = addHoursUTC(maxDate, -1);

	let clampedTo = isAfter(to, maxDate) ? maxDate : to;
	if (!isAfter(clampedTo, clampedFrom)) clampedTo = addHoursUTC(clampedFrom, 1);

	return { from: clampedFrom, to: clampedTo };
}
