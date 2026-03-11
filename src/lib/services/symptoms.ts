import type { SymptomRepository } from '$db/repository/types';
import type { Logger } from '$lib/logging';
import type { SymptomRecord, SymptomSeverity } from '$lib/types';

export function createSymptomService(repo: SymptomRepository, logger: Logger) {
	async function submitSymptoms(values: Record<string, number>) {
		const entry: Omit<SymptomRecord, 'id'> = {
			timestamp: new Date(),
			eyes: values['eyes'] as SymptomSeverity,
			nose: values['nose'] as SymptomSeverity,
			throat: values['throat'] as SymptomSeverity,
			breathing: values['breathing'] as SymptomSeverity
		};

		try {
			const result = await repo.add(entry);
			logger.debug('Symptoms submitted', { entry });
			return result;
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error('Failed to submit symptoms', { entry, error });
			throw err;
		}
	}
	return { submitSymptoms };
}
