<script>
	import { getSymptomState, SymptomTable } from '$lib/symptoms';

	const symptomData = getSymptomState();
</script>

<h2>History</h2>
<SymptomTable title="Symptom Log" records={symptomData.symptoms} />
