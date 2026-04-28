<script lang="ts">
	import { getSymptomState } from '$lib/symptoms';
	import SymptomForm from '$lib/components/SymptomForm.svelte';
	import SymptomTable from '$lib/components/SymptomTable.svelte';
	import LocationInput from '$lib/components/LocationInput.svelte';
	import SymptomCalendarGraph from '$lib/components/SymptomCalendarGraph.svelte';
	import SymptomBarGraph from '$lib/components/SymptomBarGraph.svelte';
	import { ErrorDisplay } from '$lib/errors';

	const records = getSymptomState();
</script>

<h1>Snot.app</h1>
<LocationInput />
<SymptomForm />
<ErrorDisplay />
<SymptomBarGraph title="Average severity today" records={records.todaysSymptoms} />
<SymptomCalendarGraph title="Symptom count per day" records={records.symptoms} />
<SymptomTable title="Symptom Log" records={records.symptoms} />
