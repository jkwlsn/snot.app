import Dexie from 'dexie';
import type { SnotDatabaseSchema } from './types';

class SnotDatabase extends Dexie implements SnotDatabaseSchema {
	symptoms!: SnotDatabaseSchema['symptoms'];

	constructor() {
		super('snot-app');
		this.version(1).stores({
			symptoms: '++id, createdAt'
		});
	}
}

export const database = new SnotDatabase();
