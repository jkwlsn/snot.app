export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogPayload {
	message: string;
	data?: unknown;
	tags?: Record<string, string>;
	error?: Error | unknown;
}

export interface Logger {
	log(level: LogLevel, payload: LogPayload): void;
}
