<script lang="ts">
	import { EntryBarGraph, EntryCalendarGraph, EntryForm, getEntryState } from '$lib/entries';
	import { getEnvironmentState } from '$lib/environment';
	import SeverityIndicator from '$lib/environment/components/SeverityIndicator.svelte';

	const entries = getEntryState();
	const env = getEnvironmentState();
</script>

<h2>Overview</h2>
<EntryForm />
<SeverityIndicator data={env.current.data} />
<EntryBarGraph title="Average severity today" records={entries.entries} />
<EntryCalendarGraph title="Symptom count per day" records={entries.entries} />
