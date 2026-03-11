import { liveQuery } from 'dexie';
import { symptomService as service } from '$lib/services';

export const state = $state<{ error: Error | null }>({ error: null });

export const symptoms = liveQuery(async () => {
	try {
		return await service.getAllSymptoms();
	} catch (e) {
		state.error = e instanceof Error ? e : new Error(String(e));
		return [];
	}
});
