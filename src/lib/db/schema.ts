import Dexie, { type Table } from 'dexie';
import type { SymptomEntry, AppSettings } from '$lib/types';

export class SnotDB extends Dexie {
	symptoms!: Table<SymptomEntry>;
	settings!: Table<AppSettings>;

	constructor() {
		super('snot-app');
		this.version(1).stores({
			symptoms: '++id, timestamp',
			settings: '++id &key'
		});
	}
}

export const db = new SnotDB();
