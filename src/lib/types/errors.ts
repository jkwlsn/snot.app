import type { Logger } from './logging';

export interface AppError<T = unknown> extends Error {
	code: string;
	timestamp: Date;
	details?: T;
}

export interface HandleErrorOptions {
	logger: Logger;
	code?: string;
	context?: Record<string, unknown>;
	show?: boolean;
}
