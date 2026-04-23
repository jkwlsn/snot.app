export interface WithId {
	id: number;
}

export interface CreatedAt {
	createdAt: Date;
}

export type Stored<T> = T & WithId;

export type StoredId = WithId['id'];
