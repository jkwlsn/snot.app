import type { PollenSeverityLevel, PollenType } from '$lib/environment';
import type { UserLocation } from '$lib/location';

export type Theme = 'light' | 'dark' | 'system';

export interface AppSettings {
	theme: Theme;
	currentLocation: UserLocation | null;
	selectedPollenTypes: PollenType[];
	pollenSeverityLevel: PollenSeverityLevel['id'];
	savedLocations: UserLocation[];
}

export interface SettingsRepository {
	save(settings: AppSettings): void;
	load(): AppSettings | null;
	clear(): void;
}

export interface SettingsService {
	getSettings(): AppSettings;
	updateSettings(settings: Partial<AppSettings>): AppSettings;
	resetSettings(): AppSettings;
}

export interface SettingsState {
	readonly current: AppSettings;
	readonly locationPermission: PermissionState | 'unknown';
	update<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void;
	reset(): void;
}
