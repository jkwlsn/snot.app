import type { Table } from 'dexie';
import type { SymptomLog, CreateSymptomLog } from '$lib/symptoms';

export type SnotDatabaseTable<T, Key = number, InsertType = T> = Table<T, Key, InsertType>;

export interface SnotDatabaseSchema {
	symptoms: SnotDatabaseTable<SymptomLog, number, CreateSymptomLog>;
}
