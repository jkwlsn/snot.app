import { liveQuery } from 'dexie';
import { endOfDay, startOfDay } from 'date-fns';
import { handleError } from '$lib/errors';
import type { SymptomLog, SymptomService, SymptomState } from './types';
import type { LoggingService } from '$lib/logging';

export function createSymptomState(service: SymptomService, logger: LoggingService): SymptomState {
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
				// eslint-disable-next-line svelte/prefer-svelte-reactivity
				return await service.getRangeSymptoms(startOfDay(new Date()), endOfDay(new Date()));
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
