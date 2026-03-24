import { liveQuery } from 'dexie';
import { symptomService as service } from '$lib/services';
import { endOfDay, startOfDay } from 'date-fns';

export const appState = $state<{ error: Error | null }>({ error: null });

export const symptoms = liveQuery(async () => {
	try {
		return await service.getAllSymptoms();
	} catch (e) {
		appState.error = e instanceof Error ? e : new Error(String(e));
		return [];
	}
});

export const todaysSymptoms = liveQuery(async () => {
	try {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		return await service.getRangeSymptoms(startOfDay(new Date()), endOfDay(new Date()));
	} catch (err) {
		appState.error = err instanceof Error ? err : new Error(String(err));
		return [];
	}
});
