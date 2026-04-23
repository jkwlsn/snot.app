import type { SymptomRepository } from '$lib/db/repository';
import type { SymptomFields, SymptomService } from '$lib/types';
import type { LocationState } from '$lib/types/state';

export function createSymptomService(
	repo: SymptomRepository,
	locationState: LocationState
): SymptomService {
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
