import { createSymptomRepository } from './symptoms';
import { logger } from '$lib/logger';

export const symptomRepository = createSymptomRepository(logger);
