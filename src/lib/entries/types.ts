import type { PollenMeasurement } from '$lib/environment/types';
import type { WithLocation } from '$lib/location';
import type { SymptomFields } from '$lib/symptoms';
import type { CreatedAt, Repository, Stored, WithTimezone } from '$lib/types';
import type { UTCDate } from '@date-fns/utc';

export interface CreateEntry extends WithLocation {
	symptoms: SymptomFields;
	pollen: PollenMeasurement[] | undefined;
}

export type Entry = Stored<CreateEntry> & CreatedAt & WithTimezone;

export interface EntryRepository extends Repository<CreateEntry, Entry> {
	getRange(from: UTCDate, to: UTCDate): Promise<Entry[]>;
}

export interface EntryService {
	submitEntry(symptoms: SymptomFields): Promise<number>;
	getAllEntries(): Promise<Entry[]>;
	getRangeEntries(from: UTCDate, to: UTCDate): Promise<Entry[]>;
	removeEntry(id: number): Promise<void>;
}

export interface EntryState {
	readonly entries: Entry[];
	readonly todaysEntries: Entry[];
}
