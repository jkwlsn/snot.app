<script lang="ts">
	import { SYMPTOMS } from '$lib/config';
	import { getSymptomService } from '$lib/symptoms';
	import { handleError } from '$lib/errors';
	import { getLoggingService } from '$lib/logging';
	import type { SymptomLog } from '$lib/types';

	const { title, records }: { title: string; records: SymptomLog[] } = $props();

	const service = getSymptomService();
	const logger = getLoggingService();

	let isRemovingSymptom = $state<boolean>(false);
	let removingSymptomId = $state<number | null>(null);

	const COLUMNS = [
		{ header: 'ID', accessor: (r: SymptomLog) => r.id },
		{ header: 'CreatedAt', accessor: (r: SymptomLog) => r.createdAt },
		...SYMPTOMS.map((s) => ({
			header: s.name,
			accessor: (r: SymptomLog) => r.symptoms[s.name]
		})),
		{ header: 'Location', accessor: (r: SymptomLog) => r.location?.label }
	];

	async function handleRemove(e: MouseEvent, id: number) {
		e.preventDefault();

		removingSymptomId = id;

		isRemovingSymptom = true;

		try {
			await service.removeSymptom(id);
		} catch (err: unknown) {
			handleError({
				error: err,
				operation: 'removeSymptom',
				logger,
				show: true
			});
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
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</section>
