<script lang="ts">
	import { symptoms, appState } from '$lib/stores/symptoms.svelte'; // Dexie returns stores, not runes, reference these with `$`!
	import SymptomForm from '$lib/components/SymptomForm.svelte';
	import SymptomTable from '$lib/components/SymptomTable.svelte';
	import LocationInput from '$lib/components/LocationInput.svelte';
	import SymptomCalendarGraph from '$lib/components/SymptomCalendarGraph.svelte';
</script>

<h1>Snot.app</h1>
<LocationInput />
<SymptomForm />
{#if appState.error}
	<p>Failed to load symptoms: {appState.error.message}</p>
{:else}
	<SymptomCalendarGraph title="Symptom count per day" records={$symptoms} />
	<SymptomTable title="Symptom Log" records={$symptoms} />
{/if}
