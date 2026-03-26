import { createSymptomService } from './symptoms';
import { createLogger, consoleProvider } from '$lib/logging';
import { symptomRepository } from '$lib/db/repository';

const logger = createLogger(consoleProvider);

export const symptomService = createSymptomService(symptomRepository, logger);
