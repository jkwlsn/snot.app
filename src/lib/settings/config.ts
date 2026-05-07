import type { AppSettings } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
	theme: 'system',
	locationEnabled: false
};

export const SETTINGS_STORAGE_KEY = 'snot_app_settings';
