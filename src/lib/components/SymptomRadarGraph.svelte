<script lang="ts">
	import { LineChart } from 'layerchart';
	import { curveLinearClosed } from 'd3-shape';
	import { createLayerchartRadarGraph as provider } from '$lib/graphs';
	import type { SymptomRecord } from '$lib/types';

	type Props = {
		title: string;
		records: SymptomRecord[];
	};

	let { records, title }: Props = $props();

	const data = $derived(provider.transform(records ?? []));
</script>

<h2>{title}</h2>
{#if data === undefined}
	<p>Loading...</p>
{:else if data.length === 0}
	<p>No data</p>
{:else}
	<LineChart
		{data}
		x="label"
		y="value"
		yDomain={[0, 5]}
		yPadding={[0, 10]}
		radial
		points
		props={{
			spline: {
				curve: curveLinearClosed
			},
			xAxis: { tickLength: 0 },
			yAxis: { ticks: [1, 2, 3, 4, 5] },
			grid: { yTicks: [1, 2, 3, 4, 5], radialY: 'linear' }
		}}
		height={300}
	/>
{/if}
