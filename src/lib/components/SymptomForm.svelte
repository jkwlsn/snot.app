<script lang="ts">
	import { SYMPTOMS } from '$lib/config';
	import { getSymptomService } from '$lib/symptoms';
	import type { SymptomName, SymptomFields } from '$lib/types';

	const service = getSymptomService();

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

		if (isSubmittingSymptoms) return;

		isSubmittingSymptoms = true;
		submitError = null;

		try {
			await service.submitSymptoms($state.snapshot(symptomValues) as SymptomFields);

			resetValues();
		} catch (err: unknown) {
			const error = err instanceof Error ? err : new Error(String(err));
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
