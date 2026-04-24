import { setAppError } from './errorState.svelte';
import type { AppError, HandleErrorOptions } from './types';

function isAppError(err: unknown): err is AppError {
	return (
		typeof err === 'object' &&
		err !== null &&
		(err as AppError).name === 'AppError' &&
		typeof (err as AppError).code === 'string'
	);
}

export function handleError({
	error,
	operation,
	logger,
	code,
	context,
	show = false
}: HandleErrorOptions): AppError {
	let appError: AppError;

	if (isAppError(error)) {
		appError = { ...error };
		if (code) appError.code = code;
		if (context) {
			appError.details = {
				...(appError.details as Record<string, unknown>),
				...context
			};
		}
	} else {
		const errorCode = code ?? `${operation.toLocaleUpperCase()}_FAILED`;
		const errorMessage = error instanceof Error ? error.message : String(error);
		const errorStack = error instanceof Error ? error.stack : new Error().stack;

		appError = {
			name: 'AppError',
			message: errorMessage || `${operation} failed`,
			code: errorCode,
			timestamp: new Date(),
			stack: errorStack,
			details: {
				operation,
				...context,
				originalError: error
			}
		};
	}

	logger.error(appError.message, appError, {
		...context,
		operation,
		isRetried: isAppError(error)
	});

	if (show) {
		setAppError(appError);
	}

	return appError;
}
