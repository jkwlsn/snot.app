import { createSymptomRepository } from './symptomRepository';
import type { SymptomFields, SymptomService } from '$lib/symptoms';
import type { LocationState } from '$lib/location';
import type { LoggingService } from '$lib/logging';
import type { SettingsService } from '$lib/settings';

export function createSymptomService({
	logger,
	locationState,
	settingsService
}: {
	logger: LoggingService;
	locationState: LocationState;
	settingsService: SettingsService;
}): SymptomService {
	const repo = createSymptomRepository({ logger });

	return {
		submitSymptoms: (values: SymptomFields) => {
			const settings = settingsService.getSettings();
			return repo.add({
				// eslint-disable-next-line svelte/prefer-svelte-reactivity
				createdAt: new Date(),
				location: settings.locationEnabled ? $state.snapshot(locationState.currentLocation) : null,
				symptoms: values
			});
		},
		getAllSymptoms: () => repo.getAll(),
		getRangeSymptoms: (from: Date, to: Date) => repo.getRange(from, to),
		removeSymptom: (id: number) => repo.remove(id)
	};
}
