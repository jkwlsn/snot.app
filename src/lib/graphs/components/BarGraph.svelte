<script lang="ts">
	import { BarChart } from 'layerchart';
	import type { LabelledDataPoint } from '../types';

	let {
		title,
		data,
		xKey = 'label',
		yKey = 'value'
	}: {
		title: string;
		data: LabelledDataPoint[];
		xKey?: string;
		yKey?: string;
	} = $props();
</script>

<h2>{title}</h2>
{#if data === undefined}
	<p>Loading...</p>
{:else if data.length === 0}
	<p>No data</p>
{:else}
	<BarChart {data} x={xKey} y={yKey} height={300} />
{/if}
