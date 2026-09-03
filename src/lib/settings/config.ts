import { DEFAULT_SEVERITY } from '$lib/environment/severity/config';
import type { AppSettings } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
	theme: 'system',
	currentLocation: null,
	selectedPollenTypes: [],
	pollenSeverityLevel: DEFAULT_SEVERITY,
	savedLocations: []
};

export const SETTINGS_STORAGE_KEY = 'snot_app_settings';
