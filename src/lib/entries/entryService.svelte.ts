import { createEntryRepository } from './entryRepository';
import type { EntryService } from '$lib/entries';
import type { UTCDate } from '$lib/date';
import type { LocationState } from '$lib/location';
import type { LoggingService } from '$lib/logging';
import type { SettingsService } from '$lib/settings';
import type { SymptomFields } from '$lib/symptoms';
import type { EnvironmentState } from '$lib/environment/types';

export function createEntryService({
	logger,
	locationState,
	environmentState,
	settingsService
}: {
	logger: LoggingService;
	locationState: LocationState;
	environmentState: EnvironmentState;
	settingsService: SettingsService;
}): EntryService {
	const repo = createEntryRepository({ logger });

	return {
		submitEntry: (symptoms: SymptomFields) => {
			const settings = settingsService.getSettings();
			return repo.add({
				location: settings.locationEnabled ? $state.snapshot(locationState.currentLocation) : null,
				symptoms: symptoms,
				pollen: settings.locationEnabled
					? $state.snapshot(environmentState.current.data?.pollen)
					: undefined
			});
		},
		getAllEntries: () => repo.getAll(),
		getRangeEntries: (from: UTCDate, to: UTCDate) => repo.getRange(from, to),
		removeEntry: (id: number) => repo.remove(id)
	};
}
