import { liveQuery } from 'dexie';
import { getUTCNow, startOfDayUTC, endOfDayUTC } from '$lib/date';
import { handleError } from '$lib/errors';
import type { Entry, EntryService, EntryState } from './types';
import type { LoggingService } from '$lib/logging';

export function createEntryState({
	service,
	logger
}: {
	service: EntryService;
	logger: LoggingService;
}): EntryState {
	let entries = $state<Entry[]>([]);
	let todaysEntries = $state<Entry[]>([]);

	$effect(() => {
		const sub = liveQuery<Entry[]>(async () => {
			try {
				return await service.getAllEntries();
			} catch (err) {
				handleError({
					error: err,
					operation: 'getAllEntries',
					logger,
					show: true
				});
				throw err;
			}
		}).subscribe((value) => {
			entries = value;
		});

		return () => sub.unsubscribe();
	});

	$effect(() => {
		const sub = liveQuery<Entry[]>(async () => {
			try {
				const now = getUTCNow();
				return await service.getRangeEntries(startOfDayUTC(now), endOfDayUTC(now));
			} catch (err) {
				handleError({
					error: err,
					operation: 'getRangeEntries',
					logger,
					show: true
				});
				throw err;
			}
		}).subscribe((value) => {
			todaysEntries = value;
		});

		return () => sub.unsubscribe();
	});

	return {
		get entries() {
			return entries;
		},
		get todaysEntries() {
			return todaysEntries;
		}
	};
}
