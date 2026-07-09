import type { WithId, StoredId, WithTimezone } from './base';

export interface Repository<TInput, TOutput extends WithId> {
	add(entry: TInput): Promise<StoredId>;
	update(id: StoredId, patch: Partial<TInput>): Promise<void>;
	remove(id: StoredId): Promise<void>;
	getById(id: StoredId): Promise<TOutput | undefined>;
	getAll(): Promise<TOutput[]>;
}

// Utility to map a Domain entity (with UTCDate) to a Persistence entity (with number)
export type Persisted<T> = Omit<T, 'createdAt'> & { createdAt: number } & WithTimezone;
