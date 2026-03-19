<script lang="ts">
	import { symptoms, state } from '$lib/stores/symptoms.svelte'; // Dexie returns stores, not runes, reference these with `$`!
	import SymptomForm from '$lib/components/SymptomForm.svelte';
	import SymptomTable from '$lib/components/SymptomTable.svelte';
	import LocationInput from '$lib/components/LocationInput.svelte';
	import SymptomCalendarGraph from '$lib/components/SymptomCalendarGraph.svelte';
	import SymptomStackedBarGraph from '$lib/components/SymptomStackedBarGraph.svelte';
</script>

<h1>Snot.app</h1>
<LocationInput />
<SymptomForm />
{#if state.error}
	<p>Failed to load symptoms: {state.error.message}</p>
{:else if $symptoms === undefined}
	<p>Loading...</p>
{:else if $symptoms.length === 0}
	<p>No data recorded.</p>
{:else}
	<SymptomCalendarGraph graphTitle="Symptoms per day" records={$symptoms} />
	<SymptomStackedBarGraph title="Symptom types per day" records={$symptoms} />
	<SymptomTable symptoms={$symptoms} />
{/if}
