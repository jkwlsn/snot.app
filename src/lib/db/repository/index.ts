import { createSymptomRepository } from './symptoms';
import { createLogger, consoleProvider } from '$lib/logging';

const logger = createLogger(consoleProvider);

export const symptomRepository = createSymptomRepository(logger);

// Types
export type { SymptomRepository } from './types';
