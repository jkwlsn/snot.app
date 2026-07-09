import type { UTCDate } from '$lib/date';

export interface WithId {
	id: number;
}

export interface CreatedAt {
	createdAt: UTCDate;
}

export type Stored<T> = T & WithId;

export type StoredId = WithId['id'];
