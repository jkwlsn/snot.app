import { SYMPTOMS } from '$lib/config';
import type { SymptomRepository } from '$lib/db/repository';
import type { Logger } from '$lib/logging';
import type { NewSymptomRecord, SymptomSeverity, UserLocation } from '$lib/types';
import type { SymptomService } from './types';

export function createSymptomService(repo: SymptomRepository, logger: Logger): SymptomService {
	async function submitSymptoms(values: Record<string, number>, location: UserLocation | null) {
		const symptomValues = Object.fromEntries(
			SYMPTOMS.map((s) => [s.name, values[s.name] as SymptomSeverity])
		) as Record<(typeof SYMPTOMS)[number]['name'], SymptomSeverity>;

		const entry: NewSymptomRecord = {
			timestamp: new Date(),
			location: location,
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

	async function getRangeSymptoms(from: Date, to: Date) {
		try {
			const result = await repo.getRange(from, to);
			logger.debug('Got symptom within range', { from, to, result });
			return result;
		} catch (err: unknown) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error('Failed to get range of symptoms', { from, to, error });
			throw err;
		}
	}

	async function removeSymptom(id: number) {
		try {
			const result = await repo.remove(id);
			logger.debug('Deleted symptom', { result });
			return result;
		} catch (err: unknown) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error('Failed to delete symptom', { error });
			throw err;
		}
	}

	return { submitSymptoms, getAllSymptoms, getRangeSymptoms, removeSymptom };
}
