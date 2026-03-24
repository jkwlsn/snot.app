<script lang="ts">
	import { symptoms, appState, todaysSymptoms } from '$lib/stores/symptoms.svelte'; // Dexie returns stores, not runes, reference these with `$`!
	import SymptomForm from '$lib/components/SymptomForm.svelte';
	import SymptomTable from '$lib/components/SymptomTable.svelte';
	import LocationInput from '$lib/components/LocationInput.svelte';
	import SymptomCalendarGraph from '$lib/components/SymptomCalendarGraph.svelte';
	import SymptomRadarGraph from '$lib/components/SymptomRadarGraph.svelte';
</script>

<h1>Snot.app</h1>
<LocationInput />
<SymptomForm />
{#if appState.error}
	<p>Failed to load symptoms: {appState.error.message}</p>
{:else}
	<SymptomRadarGraph title="Average severity today" records={$todaysSymptoms} />
	<SymptomCalendarGraph title="Symptom count per day" records={$symptoms} />
	<SymptomTable title="Symptom Log" records={$symptoms} />
{/if}
