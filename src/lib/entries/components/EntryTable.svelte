<script lang="ts">
	import { formatDisplayDate } from '$lib/date';
	import { SYMPTOMS } from '$lib/symptoms';
	import { handleError } from '$lib/errors';
	import { getLoggingService } from '$lib/logging';
	import { getEntryService, type Entry } from '$lib/entries';

	const { title, records }: { title: string; records: Entry[] } = $props();

	const service = getEntryService();
	const logger = getLoggingService();

	let isRemoving = $state<boolean>(false);
	let removingEntryId = $state<number | null>(null);

	const COLUMNS = [
		{ header: 'ID', accessor: (r: Entry) => r.id },
		{
			header: 'CreatedAt',
			accessor: (r: Entry) => formatDisplayDate(r.createdAt, undefined, r.timezone)
		},
		...SYMPTOMS.map((s) => ({
			header: s.name,
			accessor: (r: Entry) => r.symptoms[s.name]
		})),
		{ header: 'Location', accessor: (r: Entry) => r.location?.label }
	];

	async function handleRemove(e: MouseEvent, id: number) {
		e.preventDefault();

		removingEntryId = id;

		isRemoving = true;

		try {
			await service.removeEntry(id);
		} catch (err: unknown) {
			handleError({
				error: err,
				operation: 'removeEntry',
				logger,
				show: true
			});
		} finally {
			isRemoving = false;
			removingEntryId = null;
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
								>{isRemoving && removingEntryId === record.id ? 'Removing...' : 'Remove'}</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</section>
