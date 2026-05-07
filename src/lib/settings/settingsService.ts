import { DEFAULT_SETTINGS } from './config';
import { createSettingsRepository } from './settingsRepository';
import type { LoggingService } from '$lib/logging';
import type { AppSettings, SettingsService } from './types';

export function createSettingsService({ logger }: { logger: LoggingService }): SettingsService {
	const repo = createSettingsRepository({ logger });

	const getSettings = () => {
		const stored = repo.load();
		return stored ? { ...DEFAULT_SETTINGS, ...stored } : DEFAULT_SETTINGS;
	};

	return {
		getSettings,
		updateSettings: (updates: Partial<AppSettings>) => {
			const updated = { ...getSettings(), ...updates };
			repo.save(updated);
			return updated;
		},
		resetSettings: () => {
			repo.clear();
			return DEFAULT_SETTINGS;
		}
	};
}
