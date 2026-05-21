import { database as db } from '$lib/database';
import { handleError } from '$lib/errors';
import { toUTCDate, type UTCDate } from '$lib/date';
import type { SymptomRepository, CreateSymptomLog, SymptomLog } from './types';
import type { Persisted } from '$lib/types/repository';
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

	const fromPersisted = (record: Persisted<SymptomLog>): SymptomLog => ({
		...record,
		createdAt: toUTCDate(record.createdAt)
	});

	const toPersisted = (entry: CreateSymptomLog): Persisted<CreateSymptomLog> => ({
		...entry,
		createdAt: entry.createdAt.getTime()
	});

	return {
		add: (entry: CreateSymptomLog) =>
			run('add', () => db.symptoms.add(toPersisted(entry)), { symptomEntry: entry }),

		update: (id: StoredId, patch: Partial<CreateSymptomLog>) =>
			run(
				'update',
				() => {
					const { createdAt, ...rest } = patch;
					const dbPatch: Partial<Persisted<CreateSymptomLog>> = { ...rest };
					if (createdAt) dbPatch.createdAt = createdAt.getTime();
					return db.symptoms.update(id, dbPatch).then(() => void 0);
				},
				{ id, patch }
			),

		remove: (id: StoredId) => run('remove', () => db.symptoms.delete(id), { id }),

		getById: (id: StoredId) =>
			run('getById', () => db.symptoms.get(id).then((s) => (s ? fromPersisted(s) : undefined)), {
				id
			}),

		getAll: () =>
			run('getAll', () =>
				db.symptoms
					.orderBy('createdAt')
					.reverse()
					.toArray()
					.then((symptoms) => symptoms.map(fromPersisted))
			),

		getRange: (from: UTCDate, to: UTCDate) =>
			run(
				'getRange',
				() =>
					db.symptoms
						.where('createdAt')
						.between(from.getTime(), to.getTime())
						.toArray()
						.then((symptoms) => symptoms.map(fromPersisted)),
				{
					from: from.toISOString(),
					to: to.toISOString()
				}
			)
	};
}
