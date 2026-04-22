<script lang="ts">
	import { SYMPTOMS } from '$lib/config';
	import { createLogger, consoleProvider } from '$lib/logging';
	import { getSymptomService } from '$lib/services/context';
	import type { SymptomLog } from '$lib/types';

	const { title, records }: { title: string; records: SymptomLog[] } = $props();

	const logger = createLogger(consoleProvider);
	const service = getSymptomService();

	let isRemovingSymptom = $state<boolean>(false);
	let removingSymptomId = $state<number | null>(null);
	let removeError = $state<string | null>(null);

	const COLUMNS = [
		{ header: 'ID', accessor: (r: SymptomLog) => r.id },
		{ header: 'Timestamp', accessor: (r: SymptomLog) => r.timestamp },
		...SYMPTOMS.map((s) => ({
			header: s.name,
			accessor: (r: SymptomLog) => r.symptoms[s.name]
		})),
		{ header: 'Location', accessor: (r: SymptomLog) => r.location?.label }
	];

	async function handleRemove(e: MouseEvent, id: number) {
		e.preventDefault();

		removingSymptomId = id;

		logger.debug('Attempting to remove SymptomLog', { removingSymptomId });

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
