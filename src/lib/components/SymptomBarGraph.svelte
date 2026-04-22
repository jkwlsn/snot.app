<script lang="ts">
	import { BarChart } from 'layerchart';
	import { createLayerchartBarGraph as provider } from '$lib/graphs';
	import type { SymptomLog } from '$lib/types';

	interface Props {
		title: string;
		records: SymptomLog[];
	}

	let { records, title }: Props = $props();

	const data = $derived(provider.transform(records ?? []));
</script>

<h2>{title}</h2>
{#if data === undefined}
	<p>Loading...</p>
{:else if data.length === 0}
	<p>No data</p>
{:else}
	<BarChart {data} x="label" y="value" height={300} />
{/if}
