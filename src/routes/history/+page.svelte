<script>
	import { getEntryState, EntryTable } from '$lib/entries';

	const entryData = getEntryState();
</script>

<h2>History</h2>
<EntryTable title="Symptom Log" records={entryData.entries} />
