import { liveQuery } from 'dexie';
import { endOfDay, startOfDay } from 'date-fns';
import type { SymptomRecord } from '$lib/types';
import type { SymptomService } from '$lib/services/types';

export const appState = $state<{ error: Error | null }>({ error: null });

export type SymptomsStore = ReturnType<typeof createSymptomsStore>;

export function createSymptomsStore(service: SymptomService) {
	// null = not yet loaded; [] = loaded but empty
	let symptoms = $state<SymptomRecord[] | null>(null);
	let todaysSymptoms = $state<SymptomRecord[] | null>(null);

	$effect(() => {
		const sub = liveQuery<SymptomRecord[]>(async () => {
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
		const sub = liveQuery<SymptomRecord[]>(async () => {
			try {
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
