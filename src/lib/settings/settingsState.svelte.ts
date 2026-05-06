import { createContext } from 'svelte';
import type { AppSettings, SettingsService, SettingsState } from './types';

export function createSettingsState({ service }: { service: SettingsService }): SettingsState {
	let current = $state.raw<AppSettings>(service.getSettings());

	$effect(() => {
		const colorScheme = current.theme === 'system' ? 'light dark' : current.theme;
		document.documentElement.style.colorScheme = colorScheme;
	});

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
