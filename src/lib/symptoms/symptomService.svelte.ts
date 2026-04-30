import { createSymptomRepository } from './symptomRepository';
import type { SymptomFields, SymptomService } from '$lib/symptoms';
import type { LocationState } from '$lib/types';
import type { LoggingService } from '$lib/logging';

export function createSymptomService({
	logger,
	locationState
}: {
	logger: LoggingService;
	locationState: LocationState;
}): SymptomService {
	const repo = createSymptomRepository({ logger });

	return {
		submitSymptoms: (values: SymptomFields) =>
			repo.add({
				// eslint-disable-next-line svelte/prefer-svelte-reactivity
				createdAt: new Date(),
				location: $state.snapshot(locationState.currentLocation),
				symptoms: values
			}),
		getAllSymptoms: () => repo.getAll(),
		getRangeSymptoms: (from: Date, to: Date) => repo.getRange(from, to),
		removeSymptom: (id: number) => repo.remove(id)
	};
}
