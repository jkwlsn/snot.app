import { liveQuery } from 'dexie';
import { symptomService as service } from '$lib/services';

export const appState = $state<{ error: Error | null }>({ error: null });

export const symptoms = liveQuery(async () => {
	try {
		return await service.getAllSymptoms();
	} catch (e) {
		appState.error = e instanceof Error ? e : new Error(String(e));
		return [];
	}
});
