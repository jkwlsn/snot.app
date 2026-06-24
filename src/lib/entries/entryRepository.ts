import { database as db } from './database';
import { handleError } from '$lib/errors';
import { toUTCDate, type UTCDate } from '$lib/date';
import type { Persisted } from '$lib/types/repository';
import type { LoggingService } from '$lib/logging';
import type { StoredId } from '$lib/types/base';
import type { CreateEntry, Entry, EntryRepository } from './types';

export function createEntryRepository({ logger }: { logger: LoggingService }): EntryRepository {
	async function run<T>(
		operation: string,
		fn: () => Promise<T>,
		context?: Record<string, unknown>
	): Promise<T> {
		try {
			const results = await fn();
			logger.debug(`${operation} entry successful`, { result: results, ...context });
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

	const fromPersisted = (record: Persisted<Entry>): Entry => ({
		...record,
		createdAt: toUTCDate(record.createdAt)
	});

	const toPersisted = (entry: CreateEntry): Persisted<CreateEntry> => ({
		...entry,
		createdAt: entry.createdAt.getTime()
	});

	return {
		add: (entry: CreateEntry) =>
			run('add', () => db.entries.add(toPersisted(entry)), { entry: entry }),

		update: (id: StoredId, patch: Partial<CreateEntry>) =>
			run(
				'update',
				async () => {
					const { createdAt, ...rest } = patch;
					const dbPatch: Partial<Persisted<CreateEntry>> = { ...rest };
					if (createdAt) dbPatch.createdAt = createdAt.getTime();
					return db.entries.update(id, dbPatch).then(() => void 0);
				},
				{ id, patch }
			),

		remove: (id: StoredId) => run('remove', () => db.entries.delete(id), { id }),

		getById: (id: StoredId) =>
			run('getById', () => db.entries.get(id).then((s) => (s ? fromPersisted(s) : undefined)), {
				id
			}),

		getAll: () =>
			run('getAll', () =>
				db.entries
					.orderBy('createdAt')
					.reverse()
					.toArray()
					.then((entries) => entries.map(fromPersisted))
			),

		getRange: (from: UTCDate, to: UTCDate) =>
			run(
				'getRange',
				() =>
					db.entries
						.where('createdAt')
						.between(from.getTime(), to.getTime())
						.toArray()
						.then((entries) => entries.map(fromPersisted)),
				{
					from: from.toISOString(),
					to: to.toISOString()
				}
			)
	};
}
