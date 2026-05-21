import { createSymptomRepository } from './symptomRepository';
import { getUTCNow } from '$lib/date';
import type { SymptomFields, SymptomService } from '$lib/symptoms';
import type { UTCDate } from '$lib/date';
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
				createdAt: getUTCNow(),
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				location: settings.locationEnabled ? $state.snapshot(locationState.currentLocation) : null,
				symptoms: values
			});
		},
		getAllSymptoms: () => repo.getAll(),
		getRangeSymptoms: (from: UTCDate, to: UTCDate) => repo.getRange(from, to),
		removeSymptom: (id: number) => repo.remove(id)
	};
}
