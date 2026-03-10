import { db } from '$db/schema';
import type { Logger } from '$lib/logging';
import type { SymptomEntry } from '$lib/types';
import type { SymptomRepository } from './types';

export function createSymptomRepository(logger: Logger): SymptomRepository {
	async function run<T>(
		operation: string,
		fn: () => Promise<T>,
		context?: Record<string, unknown>
	): Promise<T> {
		try {
			const results = await fn();
			logger.debug('Added symptom', { result: results });
			return results;
		} catch (err: unknown) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error(`${operation} failed`, { ...context, error });
			throw err;
		}
	}

	return {
		add: (entry) => run('add', () => db.symptoms.add(entry as SymptomEntry)),
		update: (id, patch) =>
			run('update', () => db.symptoms.update(id, patch).then(() => void 0), { id }),
		delById: (id) => run('delete', () => db.symptoms.delete(id), { id }),
		getById: (id) => run('getById', () => db.symptoms.get(id), { id }),
		getAll: () => run('getAll', () => db.symptoms.orderBy('timestamp').reverse().toArray()),
		getRange: (from, to) =>
			run('getRange', () => db.symptoms.where('timestamp').between(from, to).toArray(), {
				from,
				to
			})
	};
}
