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

	const records = getSymptomState();
</script>

<h1>Snot.app</h1>
<LocationInput />
<SymptomForm />
<ErrorDisplay />
<SymptomBarGraph title="Average severity today" records={records.todaysSymptoms} />
<SymptomCalendarGraph title="Symptom count per day" records={records.symptoms} />
<SymptomTable title="Symptom Log" records={records.symptoms} />
