import { createSymptomService } from './symptoms';
import { logger } from '$lib/logger';
import { symptomRepository } from '$lib/db/repository';

export const symptomService = createSymptomService(symptomRepository, logger);
