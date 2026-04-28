import { setAppError } from './errorState.svelte';
import type { AppError, HandleErrorOptions } from '$lib/types';

function isAppError(err: unknown): err is AppError {
	return (
		typeof err === 'object' &&
		err !== null &&
		(err as AppError).name === 'AppError' &&
		typeof (err as AppError).code === 'string'
	);
}

export function handleError(
	err: unknown,
	operation: string,
	options: HandleErrorOptions
): AppError {
	const { logger, code, context, show = false } = options;

	let appError: AppError;

	if (isAppError(err)) {
		appError = { ...err };
		if (code) appError.code = code;
		if (context) {
			appError.details = {
				...(appError.details as Record<string, unknown>),
				...context
			};
		}
	} else {
		const errorCode = code ?? `${operation.toLocaleUpperCase()}_FAILED`;
		const errorMessage = err instanceof Error ? err.message : String(err);
		const errorStack = err instanceof Error ? err.stack : new Error().stack;

		appError = {
			name: 'AppError',
			message: errorMessage || `${operation} failed`,
			code: errorCode,
			timestamp: new Date(),
			stack: errorStack,
			details: {
				operation,
				...context,
				originalError: err
			}
		};
	}

	logger.error(appError.message, appError, {
		...context,
		operation,
		isRetried: isAppError(err)
	});

	if (show) {
		setAppError(appError);
	}

	return appError;
}
