import { browser } from '$app/environment';
import type { AppErrorState, AppError } from '$lib/types';

const initialState: AppErrorState = {
	error: null
};

export const appErrorState = $state<AppErrorState>(browser ? initialState : { error: null });

export function clearAppError(): void {
	appErrorState.error = null;
}

export function setAppError(error: AppError): void {
	appErrorState.error = error;
}
