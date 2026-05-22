<script lang="ts">
	import {
		getSymptomState,
		SymptomForm,
		SymptomTable,
		SymptomBarGraph,
		SymptomCalendarGraph
	} from '$lib/symptoms';
	import { ErrorDisplay } from '$lib/errors';
	import { LocationInput } from '$lib/location';
	import { SettingsForm } from '$lib/settings';
	import {
		PollenSelector,
		ForecastDateSelector,
		MultiPollenLineChart,
		getEnvironmentState
	} from '$lib/environment';
	import SeverityIndicator from '$lib/environment/components/SeverityIndicator.svelte';

	const records = getSymptomState();
	const env = getEnvironmentState();
</script>

<h1>Snot.app</h1>
<ErrorDisplay />
<SettingsForm />
<LocationInput />
<SymptomForm />
<SeverityIndicator data={env.current.data} />
<MultiPollenLineChart data={env.forecast.data} />
<ForecastDateSelector />
<PollenSelector />
<SymptomBarGraph title="Average severity today" records={records.todaysSymptoms} />
<SymptomCalendarGraph title="Symptom count per day" records={records.symptoms} />
<SymptomTable title="Symptom Log" records={records.symptoms} />
