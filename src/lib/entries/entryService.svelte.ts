import { createEntryRepository } from './entryRepository';
import { getUTCNow } from '$lib/date';
import type { EntryService } from '$lib/entries';
import type { UTCDate } from '$lib/date';
import type { LocationState } from '$lib/location';
import type { LoggingService } from '$lib/logging';
import type { SettingsService } from '$lib/settings';
import type { SymptomFields } from '$lib/symptoms';

export function createEntryService({
	logger,
	locationState,
	settingsService
}: {
	logger: LoggingService;
	locationState: LocationState;
	settingsService: SettingsService;
}): EntryService {
	const repo = createEntryRepository({ logger });

	return {
		submitEntry: (symptoms: SymptomFields) => {
			const settings = settingsService.getSettings();
			return repo.add({
				createdAt: getUTCNow(),
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				location: settings.locationEnabled ? $state.snapshot(locationState.currentLocation) : null,
				symptoms: symptoms
			});
		},
		getAllEntries: () => repo.getAll(),
		getRangeEntries: (from: UTCDate, to: UTCDate) => repo.getRange(from, to),
		removeEntry: (id: number) => repo.remove(id)
	};
}
