import { liveQuery } from 'dexie';
import { endOfDay, startOfDay } from 'date-fns';
import type { SymptomLog } from '$lib/types';
import type { SymptomService } from '$lib/services';

export const appState = $state<{ error: Error | null }>({ error: null });

export type SymptomsState = ReturnType<typeof createSymptomsState>;

export function createSymptomsState(service: SymptomService) {
	let symptoms = $state<SymptomLog[]>([]);
	let todaysSymptoms = $state<SymptomLog[]>([]);

	$effect(() => {
		const sub = liveQuery<SymptomLog[]>(async () => {
			try {
				return await service.getAllSymptoms();
			} catch (e) {
				appState.error = e instanceof Error ? e : new Error(String(e));
				return [];
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
			} catch (e) {
				appState.error = e instanceof Error ? e : new Error(String(e));
				return [];
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
