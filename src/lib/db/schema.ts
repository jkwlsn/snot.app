import Dexie, { type Table } from 'dexie';
import type { SymptomLog, AppSettings, CreateSymptomLog } from '$lib/types';

export class SnotDB extends Dexie {
	symptoms!: Table<SymptomLog, number, CreateSymptomLog>;
	settings!: Table<AppSettings>;

	constructor() {
		super('snot-app');
		this.version(1).stores({
			symptoms: '++id, createdAt'
		});
	}
}

export const db = new SnotDB();
