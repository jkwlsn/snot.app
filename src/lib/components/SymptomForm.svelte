<script lang="ts">
	import { SYMPTOMS } from '$lib/config';
	import { logger } from '$lib/logger';
	import { symptomService as service } from '$lib/services';

	type SymptomName = (typeof SYMPTOMS)[number]['name'];

	const symptomValues = $state<Record<string, number>>(
		Object.fromEntries(SYMPTOMS.map((symptom) => [symptom.name, 0])) as Record<SymptomName, number>
	);

	let isSubmittingSymptoms = $state<boolean>(false);
	let submitError = $state<string | null>(null);

	function resetValues() {
		SYMPTOMS.forEach((symptom) => (symptomValues[symptom.name] = 0));
	}

	function handleReset(e: Event) {
		e.preventDefault();
		resetValues();
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		logger.debug('Attempting to submit symptoms', { symptomValues });

		if (isSubmittingSymptoms) return;

		isSubmittingSymptoms = true;
		submitError = null;

		try {
			const results = await service.submitSymptoms(symptomValues);
			resetValues();
			logger.debug('Symptoms submitted', { results });
		} catch (err: unknown) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error(`Submitting symptom failed`, { error });
			submitError = error.message;
		} finally {
			isSubmittingSymptoms = false;
		}
	}
</script>

{#if submitError}
	<p role="alert">{submitError}</p>
{/if}
<form id="symptom-input" onreset={handleReset} onsubmit={handleSubmit}>
	{#each SYMPTOMS as symptom (symptom.name)}
		{@const valueId = `${symptom.name}-value`}
		<div>
			<label for={symptom.name}>{symptom.name}</label>
			<input
				type="range"
				min="0"
				max="5"
				step="1"
				name={symptom.name}
				id={symptom.name}
				bind:value={symptomValues[symptom.name]}
			/>
			<span id={valueId}>{symptomValues[symptom.name]}</span>
		</div>
	{/each}
	<button type="reset">Reset</button>
	<button type="submit" disabled={isSubmittingSymptoms}>
		{isSubmittingSymptoms ? 'Submitting...' : 'Submit'}
	</button>
</form>
