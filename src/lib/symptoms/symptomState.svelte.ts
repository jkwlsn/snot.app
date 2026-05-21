import { liveQuery } from 'dexie';
import { getUTCNow, startOfDayUTC, endOfDayUTC } from '$lib/date';
import { handleError } from '$lib/errors';
import type { SymptomLog, SymptomService, SymptomState } from './types';
import type { LoggingService } from '$lib/logging';

export function createSymptomState({
	service,
	logger
}: {
	service: SymptomService;
	logger: LoggingService;
}): SymptomState {
	let symptoms = $state<SymptomLog[]>([]);
	let todaysSymptoms = $state<SymptomLog[]>([]);

	$effect(() => {
		const sub = liveQuery<SymptomLog[]>(async () => {
			try {
				return await service.getAllSymptoms();
			} catch (err) {
				handleError({
					error: err,
					operation: 'getAllSymptoms',
					logger,
					show: true
				});
				throw err;
			}
		}).subscribe((value) => {
			symptoms = value;
		});

		return () => sub.unsubscribe();
	});

	$effect(() => {
		const sub = liveQuery<SymptomLog[]>(async () => {
			try {
				const now = getUTCNow();
				return await service.getRangeSymptoms(startOfDayUTC(now), endOfDayUTC(now));
			} catch (err) {
				handleError({
					error: err,
					operation: 'getRangeSymptoms',
					logger,
					show: true
				});
				throw err;
			}
		}).subscribe((value) => {
			todaysSymptoms = value;
		});

		return () => sub.unsubscribe();
	});

	return {
		get symptoms() {
			return symptoms;
		},
		get todaysSymptoms() {
			return todaysSymptoms;
		}
	};
}
