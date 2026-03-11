<script lang="ts">
	import { symptoms, state } from '$lib/stores/symptoms.svelte'; // Dexie returns stores, not runes, reference these with `$`!
	import SymptomForm from '$lib/components/SymptomForm.svelte';
	import SymptomTable from '$lib/components/SymptomTable.svelte';
</script>

<h1>Snot.app</h1>
<SymptomForm />
{#if state.error}
	<p>Failed to load symptoms: {state.error.message}</p>
{:else if $symptoms === undefined}
	<p>Loading...</p>
{:else if $symptoms.length === 0}
	<p>No data recorded.</p>
{:else}
	<SymptomTable symptoms={$symptoms} />
{/if}
