import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Entry, CreateEntry } from './types';
import type { Persisted } from '$lib/types/repository';

type SnotDatabaseTable<T, Key = number, InsertType = T> = Table<T, Key, InsertType>;

interface SnotDatabaseSchema {
	entries: SnotDatabaseTable<Persisted<Entry>, number, Persisted<CreateEntry>>;
}

class SnotDatabase extends Dexie implements SnotDatabaseSchema {
	entries!: SnotDatabaseSchema['entries'];

	constructor() {
		super('snot-app');
		this.version(1).stores({
			entries: '++id, createdAt'
		});
	}
}

export const database = new SnotDatabase();
