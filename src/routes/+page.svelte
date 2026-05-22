<script lang="ts">
	import {
		getSymptomState,
		SymptomForm,
		SymptomBarGraph,
		SymptomCalendarGraph
	} from '$lib/symptoms';
	import { getEnvironmentState } from '$lib/environment';
	import SeverityIndicator from '$lib/environment/components/SeverityIndicator.svelte';

	const records = getSymptomState();
	const env = getEnvironmentState();
</script>

<h2>Overview</h2>
<SymptomForm />
<SeverityIndicator data={env.current.data} />
<SymptomBarGraph title="Average severity today" records={records.todaysSymptoms} />
<SymptomCalendarGraph title="Symptom count per day" records={records.symptoms} />
