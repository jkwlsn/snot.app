import { SETTINGS_STORAGE_KEY } from './config';
import { browser } from '$app/environment';
import { handleError } from '$lib/errors';
import type { AppSettings, SettingsRepository } from './types';
import type { LoggingService } from '$lib/logging';

export function createSettingsRepository({
	logger
}: {
	logger: LoggingService;
}): SettingsRepository {
	function run<T>(
		operation: string,
		fn: () => T,
		fallback?: T,
		context?: Record<string, unknown>
	): T {
		if (!browser) return fallback as T;
		try {
			const results = fn();
			logger.debug(`${operation} settings successful`, { results, ...context });
			return results;
		} catch (error: unknown) {
			handleError({ error, operation, logger, context });
			return fallback as T;
		}
	}

	return {
		save: (settings: AppSettings) =>
			run(
				'save',
				() => localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings)),
				undefined,
				{ settings }
			),
		load: () =>
			run(
				'load',
				() => {
					const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
					return stored ? JSON.parse(stored) : null;
				},
				null,
				{ SETTINGS_STORAGE_KEY }
			),
		clear: () =>
			run('clear', () => localStorage.removeItem(SETTINGS_STORAGE_KEY), undefined, {
				SETTINGS_STORAGE_KEY
			})
	};
}
