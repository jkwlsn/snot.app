import { db } from '$db/schema';
import type { Logger } from '$lib/logging';
import type { SymptomEntry } from '$lib/types';
import type { SymptomRepository } from './types';

export function createSymptomRepository(logger: Logger): SymptomRepository {
	async function add(entry: SymptomEntry): Promise<number> {
		try {
			const results = await db.symptoms.add(entry as SymptomEntry);
			logger.debug('Added symptom', { result: results });
			return results;
		} catch (err: unknown) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error('add failed', { error });
			throw err;
		}
	}

	async function update(id: number, patch: Partial<SymptomEntry>): Promise<void> {
		try {
			const results = await db.symptoms.update(id, patch).then(() => void 0);
			logger.debug('Updated symptom', { result: results });
			return results;
		} catch (err: unknown) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error('update failed', { error });
			throw err;
		}
	}

	async function delById(id: number): Promise<void> {
		try {
			const results = await db.symptoms.delete(id);
			logger.debug('Deleted symptom', { result: results });
			return results;
		} catch (err: unknown) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error('delById failed', { error });
			throw err;
		}
	}

	async function getById(id: number): Promise<SymptomEntry | undefined> {
		try {
			const results = await db.symptoms.get(id);
			logger.debug('Get symptom by id', { result: results });
			return results;
		} catch (err: unknown) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error('getById failed', { error });
			throw err;
		}
	}

	async function getAll(): Promise<SymptomEntry[]> {
		try {
			const results = await db.symptoms.orderBy('timestamp').reverse().toArray();
			logger.debug('Get all symptoms', { results: results });
			return results;
		} catch (err: unknown) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error('getAll failed', { error });
			throw err;
		}
	}

	async function getRange(from: Date, to: Date): Promise<SymptomEntry[]> {
		try {
			const results = await db.symptoms.where('timestamp').between(from, to).toArray();
			logger.debug('get range of symptoms', { results: results });
			return results;
		} catch (err: unknown) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error('getRange failed', { error });
			throw err;
		}
	}

	return {
		add,
		update,
		delById,
		getById,
		getAll,
		getRange
	};
}
