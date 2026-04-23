import type { CreatedAt } from './base';

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

export interface Logger {
	debug(message: string, context?: LogEntry['context']): void;
	info(message: string, context?: LogEntry['context']): void;
	warn(message: string, context?: LogEntry['context']): void;
	error(message: string, context?: LogEntry['context'] & { error: Error }): void;
}
