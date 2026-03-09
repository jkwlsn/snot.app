import type { Logger } from '../types';

export function createNullLogger(): Logger {
	return { log: () => {} };
}
