import type { LogEntry, LogProvider } from '../types';

export const consoleProvider: LogProvider = {
	log: ({ level, message, context, error }: LogEntry) => {
		const extras: unknown[] = [];
		if (context) extras.push(context);
		if (error) extras.push(error);

		console[level](message, ...extras);
	}
};
