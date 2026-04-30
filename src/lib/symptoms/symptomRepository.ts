import { db } from '$lib/db/schema';
import { handleError } from '$lib/errors';
import type { SymptomRepository, CreateSymptomLog } from '$lib/symptoms';
import type { LoggingService } from '$lib/logging';
import type { StoredId } from '$lib/types/base';

export function createSymptomRepository({ logger }: { logger: LoggingService }): SymptomRepository {
	async function run<T>(
		operation: string,
		fn: () => Promise<T>,
		context?: Record<string, unknown>
	): Promise<T> {
		try {
			const results = await fn();
			logger.debug(`${operation} symptom successful`, { result: results, ...context });
			return results;
		} catch (err: unknown) {
			const structuredError = handleError({
				error: err,
				operation,
				logger,
				context
			});
			throw structuredError;
		}
	}

	return {
		add: (entry: CreateSymptomLog) =>
			run('add', () => db.symptoms.add(entry), { symptomEntry: entry }),
		update: (id: StoredId, patch: Partial<CreateSymptomLog>) =>
			run('update', () => db.symptoms.update(id, patch).then(() => void 0), { id, patch }),
		remove: (id: StoredId) => run('remove', () => db.symptoms.delete(id), { id }),
		getById: (id: StoredId) => run('getById', () => db.symptoms.get(id), { id }),
		getAll: () => run('getAll', () => db.symptoms.orderBy('createdAt').reverse().toArray()),
		getRange: (from: Date, to: Date) =>
			run('getRange', () => db.symptoms.where('createdAt').between(from, to).toArray(), {
				from: from.toISOString(),
				to: to.toISOString()
			})
	};
}
