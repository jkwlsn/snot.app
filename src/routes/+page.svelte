<script lang="ts">
	import { EntryBarGraph, EntryCalendarGraph, EntryForm, getEntryState } from '$lib/entries';
	import { getEnvironmentState, SeverityIndicator } from '$lib/environment';
	import {
		addSeverityToSeries,
		createPollenSeverityNotifications
	} from '$lib/environment/severity';

	const entries = getEntryState();
	const env = getEnvironmentState();

	const notifications = $derived(
		env.current.data
			? createPollenSeverityNotifications(addSeverityToSeries(env.current.data), 4)
			: []
	);
</script>

<h2>Overview</h2>
<EntryForm />
<SeverityIndicator {notifications} />
<EntryBarGraph title="Average severity today" records={entries.entries} />
<EntryCalendarGraph title="Symptom count per day" records={entries.entries} />
