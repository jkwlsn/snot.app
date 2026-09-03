<script lang="ts">
	import { EntryCalendarGraph, EntryForm, getEntryState } from '$lib/entries';
	import { getEnvironmentState, SeverityIndicator } from '$lib/environment';
	import {
		addSeverityToObservation,
		createPollenSeverityNotifications
	} from '$lib/environment/severity';
	import { getSettingsContext } from '$lib/settings';
	import { locationState } from '$lib/location';

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
{#if locationState.currentLocation}
	<SeverityIndicator {notifications} />
{:else}
	<p>Set a location to view pollen forecast.</p>
{/if}
<EntryCalendarGraph title="Symptom count per day" records={entries.entries} />
