import type { LogEntry, LogProvider } from '$lib/types';

export const consoleProvider: LogProvider = {
	log: ({ level, message, context, error }: LogEntry) => {
		const extras = ([context, error] as unknown[]).filter(Boolean);
		(console[level] as (...args: unknown[]) => void)(message, ...extras);
	}
};
