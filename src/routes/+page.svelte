<script lang="ts">
	import {
		getSymptomState,
		SymptomForm,
		averageSeverityBySymptom,
		aggregateSymptomsByDay
	} from '$lib/symptoms';
	import { getEnvironmentState } from '$lib/environment';
	import SeverityIndicator from '$lib/environment/components/SeverityIndicator.svelte';
	import { calculateCDomain, BarGraph, CalendarGraph, type LabelledDataPoint } from '$lib/graphs';

	const records = getSymptomState();
	const env = getEnvironmentState();

	const averageSymptomSeverityToday: LabelledDataPoint[] = $derived(
		averageSeverityBySymptom(records.todaysSymptoms)
	);
	const totalSymptomsPerDay = $derived(aggregateSymptomsByDay(records.symptoms));
	const cDomain = $derived(calculateCDomain(totalSymptomsPerDay));
</script>

<h2>Overview</h2>
<SymptomForm />
<SeverityIndicator data={env.current.data} />
<BarGraph title="Average severity today" data={averageSymptomSeverityToday} />
<CalendarGraph title="Symptom count per day" data={totalSymptomsPerDay} {cDomain} />
