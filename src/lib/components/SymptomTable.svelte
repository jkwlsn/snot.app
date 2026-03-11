<script lang="ts">
	import { SYMPTOMS } from '$lib/config';
	import { logger } from '$lib/logger';
	import { symptomService as service } from '$lib/services';
	import type { SymptomRecord } from '$lib/types';

	let { symptoms }: { symptoms: SymptomRecord[] } = $props();
	let isRemovingSymptom = $state<boolean>(false);
	let removeError = $state<string | null>(null);

	const COLUMNS = [
		{ header: 'ID', accessor: (r: SymptomRecord) => r.id },
		{ header: 'Timestamp', accessor: (r: SymptomRecord) => r.timestamp },
		...SYMPTOMS.map((s) => ({
			header: s.name,
			accessor: (r: SymptomRecord) => r[s.name]
		}))
	];

	async function handleRemove(e: MouseEvent, id: number) {
		e.preventDefault();

		logger.debug('Attempting to remove SymptomRecord', { id });

		isRemovingSymptom = true;
		removeError = null;

		try {
			const results = await service.removeSymptom(id);
			logger.debug('Symptom deleted', { results });
		} catch (err: unknown) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error(`Submitting symptom failed`, { error });
			removeError = error.message;
		} finally {
			isRemovingSymptom = false;
		}
	}
</script>

<table>
	<thead>
		<tr>
			{#each COLUMNS as col (col.header)}
				<th>{col.header}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each symptoms as record (record.id)}
			<tr>
				{#each COLUMNS as col (col.header)}
					<td>{col.accessor(record)}</td>
				{/each}
				<td><button onclick={(e) => handleRemove(e, record.id)}>Delete</button></td>
			</tr>
		{/each}
	</tbody>
</table>
