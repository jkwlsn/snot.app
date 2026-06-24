<script lang="ts">
	import { BarChart } from 'layerchart';
	import { createLayerchartBarGraph as provider } from '../providers/layerchartBarGraph';
	import type { Entry } from '../types';

	interface Props {
		title: string;
		records: Entry[];
	}

	let { title, records }: Props = $props();

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
