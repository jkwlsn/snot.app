import Dexie, { type Table } from 'dexie';
import type { SymptomRecord, AppSettings, CreateSymptomRecord } from '$lib/types';

export class SnotDB extends Dexie {
	symptoms!: Table<SymptomRecord, number, CreateSymptomRecord>;
	settings!: Table<AppSettings>;

	constructor() {
		super('snot-app');
		this.version(1).stores({
			symptoms: '++id, timestamp'
		});
	}
}

export const db = new SnotDB();
