import type { Logger } from '../types/logging';

export interface AppErrorState {
	error: AppError | null;
}

export interface AppError<T = unknown> extends Error {
	code: string;
	timestamp: Date;
	details?: T;
}

export interface HandleErrorOptions {
	error: unknown;
	operation: string;
	logger: Logger;
	code?: string;
	context?: Record<string, unknown>;
	show?: boolean;
}
