import type { Table } from 'dexie';
import type { SymptomLog, CreateSymptomLog } from '$lib/symptoms';
import type { Persisted } from '$lib/types/repository';

export type SnotDatabaseTable<T, Key = number, InsertType = T> = Table<T, Key, InsertType>;

export interface SnotDatabaseSchema {
	symptoms: SnotDatabaseTable<Persisted<SymptomLog>, number, Persisted<CreateSymptomLog>>;
}
