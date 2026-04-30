import type { LoggingService, LogContext } from '$lib/logging';

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
	logger: LoggingService;
	code?: string;
	context?: LogContext;
	show?: boolean;
}
