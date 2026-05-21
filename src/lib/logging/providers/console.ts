import { formatDisplayDate } from '$lib/date';
import type { LogEntry, LogProvider } from '../types';

export const consoleProvider: LogProvider = {
	log: ({ level, message, context, error, createdAt, timezone }: LogEntry) => {
		const formattedDate = formatDisplayDate(createdAt, undefined, timezone);
		const extras: unknown[] = [];
		if (context) extras.push(context);
		if (error) extras.push(error);

		console[level](`[${formattedDate}] ${message}`, ...extras);
	}
};
