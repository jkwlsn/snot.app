<script lang="ts">
	import { SYMPTOMS } from '$lib/symptoms';
	import { getLoggingService } from '$lib/logging';
	import { handleError } from '$lib/errors';
	import { getEntryService } from '$lib/entries';
	import type { SymptomName, SymptomFields } from '$lib/symptoms';

	const service = getEntryService();
	const logger = getLoggingService();

	const symptomValues = $state<Record<string, number>>(
		Object.fromEntries(SYMPTOMS.map((symptom) => [symptom.name, 0])) as Record<SymptomName, number>
	);

	let isSubmitting = $state<boolean>(false);

	function resetValues() {
		SYMPTOMS.forEach((symptom) => (symptomValues[symptom.name] = 0));
	}

	function handleReset(e: Event) {
		e.preventDefault();
		resetValues();
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (isSubmitting) return;

		isSubmitting = true;

		try {
			await service.submitEntry($state.snapshot(symptomValues) as SymptomFields);

			resetValues();
		} catch (err: unknown) {
			handleError({
				error: err,
				operation: 'submitEntry',
				logger,
				show: true
			});
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form id="entry-input" onreset={handleReset} onsubmit={handleSubmit}>
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
	<button type="submit" disabled={isSubmitting}>
		{isSubmitting ? 'Submitting...' : 'Submit'}
	</button>
</form>
