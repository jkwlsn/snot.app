import { DEFAULT_SEVERITY } from '$lib/environment/severity/config';
import type { AppSettings } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
	theme: 'system',
	locationEnabled: false,
	pollenSeverityLevel: DEFAULT_SEVERITY
};

export const SETTINGS_STORAGE_KEY = 'snot_app_settings';
