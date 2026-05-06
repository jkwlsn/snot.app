import { createContext } from 'svelte';
import type { AppSettings, SettingsService, SettingsState } from './types';

export function createSettingsState({ service }: { service: SettingsService }): SettingsState {
	let current = $state.raw<AppSettings>(service.getSettings());

	return {
		get current() {
			return current;
		},
		update: (key, value) => {
			current = service.updateSettings({ [key]: value });
		},
		reset() {
			current = service.resetSettings();
		}
	};
}

export const [getSettingsContext, setSettingsContext] = createContext<SettingsState>();
