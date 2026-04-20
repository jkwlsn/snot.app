import type { Timestamp } from '$lib/types';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry extends Timestamp {
	level: LogLevel;
	message: string;
	context?: Record<string, unknown>;
	error?: Error;
}

export interface LogProvider {
	log(entry: LogEntry): void;
}
