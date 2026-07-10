<script lang="ts">
	import { EntryBarGraph, EntryCalendarGraph, EntryForm, getEntryState } from '$lib/entries';
	import { getEnvironmentState, SeverityIndicator } from '$lib/environment';
	import {
		addSeverityToObservation,
		createPollenSeverityNotifications
	} from '$lib/environment/severity';
	import { getSettingsContext } from '$lib/settings';

	const entries = getEntryState();
	const env = getEnvironmentState();
	const settings = getSettingsContext();

	const notifications = $derived(
		env.current.data
			? createPollenSeverityNotifications(
					addSeverityToObservation(env.current.data),
					settings.current.pollenSeverityLevel
				)
			: []
	);
</script>

<h2>Overview</h2>
<EntryForm />
<SeverityIndicator {notifications} />
<EntryBarGraph title="Average severity today" records={entries.entries} />
<EntryCalendarGraph title="Symptom count per day" records={entries.entries} />
