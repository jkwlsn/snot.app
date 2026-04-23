import type { CreatedAt } from '$lib/types';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry extends CreatedAt {
	level: LogLevel;
	message: string;
	context?: Record<string, unknown>;
	error?: Error;
}

export interface LogProvider {
	log(entry: LogEntry): void;
}
