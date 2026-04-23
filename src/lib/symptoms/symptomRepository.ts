import { db } from '$lib/db/schema';
import type { SymptomRepository, Logger } from '$lib/types';

export function createSymptomRepository(logger: Logger): SymptomRepository {
	async function run<T>(
		operation: string,
		fn: () => Promise<T>,
		context?: Record<string, unknown>
	): Promise<T> {
		try {
			const results = await fn();
			logger.debug(`${operation} symptom successful`, { result: results });
			return results;
		} catch (err: unknown) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error(`${operation} failed`, error, { ...context });
			throw err;
		}
	}

	return {
		add: (entry) => run('add', () => db.symptoms.add(entry)),
		update: (id, patch) =>
			run('update', () => db.symptoms.update(id, patch).then(() => void 0), { id }),
		remove: (id) => run('remove', () => db.symptoms.delete(id), { id }),
		getById: (id) => run('getById', () => db.symptoms.get(id), { id }),
		getAll: () => run('getAll', () => db.symptoms.orderBy('createdAt').reverse().toArray()),
		getRange: (from, to) =>
			run('getRange', () => db.symptoms.where('createdAt').between(from, to).toArray(), {
				from,
				to
			})
	};
}
