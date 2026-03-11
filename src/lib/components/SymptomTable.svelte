<script lang="ts">
	import { liveQuery } from 'dexie';
	import { symptomService as service } from '$lib/services';
	import { SYMPTOMS } from '$lib/config';
	import type { SymptomRecord } from '$lib/types';

	const symptoms = liveQuery(() => service.getAllSymptoms());

	function getSymptomValues(entry: SymptomRecord): (number | Date)[] {
		return SYMPTOMS.map((symptom) => entry[symptom.name as keyof SymptomRecord]);
	}
</script>

<h2>Symptom table</h2>
{#if $symptoms === undefined}
	<p>Loading...</p>
{:else if $symptoms.length === 0}
	<p>No data recorded.</p>
{:else}
	<table>
		<thead>
			<tr>
				<th>ID</th>
				<th>Timestamp</th>
				{#each SYMPTOMS as col (col.name)}
					<th>
						{col.name}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each $symptoms as entry (entry.id)}
				<tr>
					<td>
						{entry.id}
					</td>
					<td>
						{entry.timestamp}
					</td>
					{#each getSymptomValues(entry) as value}
						<td>
							{value}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
