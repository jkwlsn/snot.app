import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { addSeconds } from 'date-fns/addSeconds';
import { addHours } from 'date-fns/addHours';
import { addDays } from 'date-fns/addDays';
import { startOfDay } from 'date-fns/startOfDay';
import { endOfDay } from 'date-fns/endOfDay';
import { isSameDay } from 'date-fns/isSameDay';
import { TZDate } from '@date-fns/tz';
import { UTCDate } from '@date-fns/utc';

export { UTCDate, parseISO };

// Type guard to ensure a value is a UTCDate
export function isUTCDate(value: unknown): value is UTCDate {
	return value instanceof UTCDate;
}

// Domain functions

// Returns the current time as a UTC Date object
export function getUTCNow(): UTCDate {
	return new UTCDate();
}

// Converts a Date, number, or string to a UTCDate
export function toUTCDate(date: Date | number | string): UTCDate {
	return new UTCDate(date);
}

// Parses a datetime-local string (YYYY-MM-DDTHH:mm) in a specific timezone and returns as UTCDate
export function fromDateTimeLocalToUTC(value: string, timeZone: string): UTCDate {
	const date = new TZDate(parseISO(value), timeZone);
	return new UTCDate(date.getTime());
}

// Adds seconds to a UTCDate and returns a new UTCDate
export function addSecondsUTC(date: UTCDate, amount: number): UTCDate {
	return new UTCDate(addSeconds(date, amount));
}

// Adds hours to a UTCDate and returns a new UTCDate
export function addHoursUTC(date: UTCDate, amount: number): UTCDate {
	return new UTCDate(addHours(date, amount));
}

// Adds days to a UTCDate and returns a new UTCDate
export function addDaysUTC(date: UTCDate, amount: number): UTCDate {
	return new UTCDate(addDays(date, amount));
}

// Returns the start of the day for a given UTCDate
export function startOfDayUTC(date: UTCDate): UTCDate {
	return new UTCDate(startOfDay(date));
}

// Returns the end of the day for a given UTCDate
export function endOfDayUTC(date: UTCDate): UTCDate {
	return new UTCDate(endOfDay(date));
}

// Checks if two UTCDate objects represent the same day
export function isSameDayUTC(dateLeft: UTCDate, dateRight: UTCDate): boolean {
	return isSameDay(dateLeft, dateRight);
}

// Display functions

// Formats a UTCDate to a 'yyyy-MM-dd' string for a specific timezone
export function toDayKey(date: UTCDate, timeZone: string): string {
	return format(new TZDate(date, timeZone), 'yyyy-MM-dd');
}

// Formats a date for an HTML datetime-local input, optionally in a specific timezone
export function toDateTimeLocalString(date: Date | number | string, timeZone?: string): string {
	const d = timeZone ? new TZDate(new Date(date), timeZone) : new Date(date);
	return format(d, "yyyy-MM-dd'T'HH:mm");
}

const DEFAULT_DISPLAY_OPTIONS: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: '2-digit',
	minute: '2-digit'
};

// Formats a date for display in the UI
export function formatDisplayDate(
	date: Date | number | string,
	options: Intl.DateTimeFormatOptions = DEFAULT_DISPLAY_OPTIONS,
	timeZone?: string
): string {
	const formatOptions = timeZone ? { ...options, timeZone } : options;
	// Intl correctly handles the timezone shift from the underlying absolute time (Date or number)
	return new Intl.DateTimeFormat(undefined, formatOptions).format(new Date(date));
}

// API

// Formats a UTCDate for API consumption (YYYY-MM-DDTHH:mm)
export function toApiFormat(date: UTCDate): string {
	return date.toISOString().slice(0, 16);
}
