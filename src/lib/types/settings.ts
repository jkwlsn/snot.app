import type { WithId } from './base';

export interface AppSettings extends WithId {
	key: string;
	value: unknown;
}
