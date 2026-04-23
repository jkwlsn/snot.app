import type { SymptomRepository } from '$lib/db/repository';
import type { SymptomFields, SymptomService, UserLocation } from '$lib/types';

export function createSymptomService(repo: SymptomRepository): SymptomService {
	return {
		submitSymptoms: (values: SymptomFields, location: UserLocation | null) =>
			repo.add({ createdAt: new Date(), location, symptoms: values }),
		getAllSymptoms: () => repo.getAll(),
		getRangeSymptoms: (from: Date, to: Date) => repo.getRange(from, to),
		removeSymptom: (id: number) => repo.remove(id)
	};
}

