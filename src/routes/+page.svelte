<script lang="ts">
	import { appState } from '$lib/state/symptoms.svelte';
	import { getSymptomsContext } from '$lib/state/context';
	import SymptomForm from '$lib/components/SymptomForm.svelte';
	import SymptomTable from '$lib/components/SymptomTable.svelte';
	import LocationInput from '$lib/components/LocationInput.svelte';
	import SymptomCalendarGraph from '$lib/components/SymptomCalendarGraph.svelte';
	import SymptomRadarGraph from '$lib/components/SymptomRadarGraph.svelte';

	const records = getSymptomsContext();
</script>

<h1>Snot.app</h1>
<LocationInput />
<SymptomForm />
{#if appState.error}
	<p>Failed to load symptoms: {appState.error.message}</p>
{:else}
	<SymptomRadarGraph title="Average severity today" records={records.todaysSymptoms} />
	<SymptomCalendarGraph title="Symptom count per day" records={records.symptoms} />
	<SymptomTable title="Symptom Log" records={records.symptoms} />
{/if}
