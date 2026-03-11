<script lang="ts">
	import { SYMPTOMS } from '$lib/config';
	import type { SymptomRecord } from '$lib/types';

	let { symptoms }: { symptoms: SymptomRecord[] } = $props();

	const COLUMNS = [
		{ header: 'ID', accessor: (r: SymptomRecord) => r.id },
		{ header: 'Timestamp', accessor: (r: SymptomRecord) => r.timestamp },
		...SYMPTOMS.map((s) => ({
			header: s.name,
			accessor: (r: SymptomRecord) => r[s.name]
		}))
	];
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
			</tr>
		{/each}
	</tbody>
</table>
