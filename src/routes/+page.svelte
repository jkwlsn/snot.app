<script lang="ts">
	import {
		getSymptomState,
		SymptomForm,
		SymptomTable,
		SymptomBarGraph,
		SymptomCalendarGraph
	} from '$lib/symptoms';
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

<h2>Overview</h2>
<SymptomForm />
<SeverityIndicator data={env.current.data} />
<MultiPollenLineChart data={env.forecast.data} />
<ForecastDateSelector />
<PollenSelector />
<SymptomBarGraph title="Average severity today" records={records.todaysSymptoms} />
<SymptomCalendarGraph title="Symptom count per day" records={records.symptoms} />
<SymptomTable title="Symptom Log" records={records.symptoms} />
