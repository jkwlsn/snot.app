import { db } from '$lib/db/schema';
import { handleError } from '$lib/errors';
import type { SymptomRepository, CreateSymptomLog } from '$lib/symptoms';
import type { LoggingService } from '$lib/logging';

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
		add: (entry) => run('add', () => db.symptoms.add(entry), { symptomEntry: entry }),
		update: (id, patch) =>
			run('update', () => db.symptoms.update(id, patch).then(() => void 0), { id, patch }),
		remove: (id) => run('remove', () => db.symptoms.delete(id), { id }),
		getById: (id) => run('getById', () => db.symptoms.get(id), { id }),
		getAll: () => run('getAll', () => db.symptoms.orderBy('createdAt').reverse().toArray()),
		getRange: (from, to) =>
			run('getRange', () => db.symptoms.where('createdAt').between(from, to).toArray(), {
				from: from.toISOString(),
				to: to.toISOString()
			})
	};
}
