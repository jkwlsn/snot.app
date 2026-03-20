<script lang="ts">
	import { SYMPTOMS } from '$lib/config';
	import { logger } from '$lib/logger';
	import { symptomService as service } from '$lib/services';
	import type { SymptomRecord } from '$lib/types';

	const { title, records }: { title: string; records: SymptomRecord[] } = $props();

	let isRemovingSymptom = $state<boolean>(false);
	let removingSymptomId = $state<number | null>(null);
	let removeError = $state<string | null>(null);

	const COLUMNS = [
		{ header: 'ID', accessor: (r: SymptomRecord) => r.id },
		{ header: 'Timestamp', accessor: (r: SymptomRecord) => r.timestamp },
		...SYMPTOMS.map((s) => ({
			header: s.name,
			accessor: (r: SymptomRecord) => r[s.name]
		})),
		{ header: 'Location', accessor: (r: SymptomRecord) => r.location?.label }
	];

	async function handleRemove(e: MouseEvent, id: number) {
		e.preventDefault();

		removingSymptomId = id;

		logger.debug('Attempting to remove SymptomRecord', { removingSymptomId });

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
			removingSymptomId = null;
		}
	}
</script>

<section>
	<h2>{title}</h2>
	{#if records?.length === 0}
		<p>No data</p>
	{:else if records === undefined}
		<p>Loading...</p>
	{:else}
		<table>
			<thead>
				<tr>
					{#each COLUMNS as col (col.header)}
						<th>{col.header}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each records as record (record.id)}
					<tr>
						{#each COLUMNS as col (col.header)}
							<td>{col.accessor(record)}</td>
						{/each}
						<td
							><button onclick={(e) => handleRemove(e, record.id)}
								>{isRemovingSymptom && removingSymptomId === record.id
									? 'Removing...'
									: 'Remove'}</button
							>
							{#if removeError}
								<aside>{removeError}</aside>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</section>
