import { createContext } from 'svelte';
import { locationState } from '$lib/location';
import type { AppSettings, SettingsService, SettingsState } from './types';

export function createSettingsState({ service }: { service: SettingsService }): SettingsState {
	let current = $state.raw<AppSettings>(service.getSettings());
	let locationPermission = $state<PermissionState | 'unknown'>('unknown');

	$effect(() => {
		const colorScheme = current.theme === 'system' ? 'light dark' : current.theme;
		document.documentElement.style.colorScheme = colorScheme;
	});

	$effect(() => {
		if (!current.locationEnabled) {
			locationState.currentLocation = null;
		}
	});

	$effect(() => {
		if (typeof navigator === 'undefined' || !('permissions' in navigator)) {
			return;
		}

		let permissionStatus: PermissionStatus;
		const onChange = () => {
			if (permissionStatus) {
				locationPermission = permissionStatus.state;
			}
		};

		navigator.permissions.query({ name: 'geolocation' }).then((status) => {
			permissionStatus = status;
			locationPermission = status.state;
			status.addEventListener('change', onChange);
		});

		return () => {
			permissionStatus?.removeEventListener('change', onChange);
		};
	});

	return {
		get current() {
			return current;
		},
		get locationPermission() {
			return locationPermission;
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
