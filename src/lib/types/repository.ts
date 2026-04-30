import type { WithId, StoredId } from './base';

export interface Repository<TInput, TOutput extends WithId> {
	add(entry: TInput): Promise<StoredId>;
	update(id: StoredId, patch: Partial<TInput>): Promise<void>;
	remove(id: StoredId): Promise<void>;
	getById(id: StoredId): Promise<TOutput | undefined>;
	getAll(): Promise<TOutput[]>;
}

export interface SymptomRepository extends Repository<CreateSymptomLog, SymptomLog> {
	getRange(from: Date, to: Date): Promise<SymptomLog[]>;
}
