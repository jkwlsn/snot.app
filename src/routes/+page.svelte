<script lang="ts">
	import {
		getSymptomState,
		SymptomForm,
		SymptomCalendarGraph,
		averageSeverityBySymptom
	} from '$lib/symptoms';
	import { getEnvironmentState } from '$lib/environment';
	import SeverityIndicator from '$lib/environment/components/SeverityIndicator.svelte';
	import { BarGraph, type LabelledDataPoint } from '$lib/graphs';

	const records = getSymptomState();
	const env = getEnvironmentState();

	const averageSymptomSeverityToday: LabelledDataPoint[] = $derived(
		averageSeverityBySymptom(records.todaysSymptoms)
	);
</script>

<h2>Overview</h2>
<SymptomForm />
<SeverityIndicator data={env.current.data} />
<BarGraph title="Average severity today" data={averageSymptomSeverityToday} />
<SymptomCalendarGraph title="Symptom count per day" records={records.symptoms} />
