import type { CreatedAt } from '../types/base';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogContext = Record<string, unknown>;

export interface LogEntry extends CreatedAt {
	level: LogLevel;
	message: string;
	context?: LogContext;
	error?: Error;
}

export interface LogProvider {
	log(entry: LogEntry): void;
}

export interface LoggingServiceOptions {
	provider: LogProvider;
	minLevel?: LogLevel;
}

export interface LoggingService {
	debug(message: string, context?: LogContext): void;
	info(message: string, context?: LogContext): void;
	warn(message: string, context?: LogContext): void;
	error(message: string, error?: Error, context?: LogContext): void;
}
