import { SYMPTOMS } from '$lib/config';
import type { SymptomRepository } from '$db/repository/types';
import type { Logger } from '$lib/logging';
import type { NewSymptomRecord, SymptomSeverity } from '$lib/types';

export function createSymptomService(repo: SymptomRepository, logger: Logger) {
	async function submitSymptoms(values: Record<string, number>) {
		const symptomValues = Object.fromEntries(
			SYMPTOMS.map((s) => [s.name, values[s.name] as SymptomSeverity])
		) as Record<(typeof SYMPTOMS)[number]['name'], SymptomSeverity>;

		const entry: NewSymptomRecord = {
			timestamp: new Date(),
			...symptomValues
		};

		try {
			const result = await repo.add(entry);
			logger.debug('Symptoms submitted', { entry });
			return result;
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error('Failed to submit symptoms', { entry, error });
			throw err;
		}
	}

	async function getAllSymptoms() {
		try {
			const result = await repo.getAll();
			logger.debug('Got all symptoms', { result });
			return result;
		} catch (err: unknown) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error('Failed to get all symptoms', { error });
			throw err;
		}
	}

	return { submitSymptoms, getAllSymptoms };
}
