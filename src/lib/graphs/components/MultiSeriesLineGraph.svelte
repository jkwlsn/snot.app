<script lang="ts">
	import { LineChart, AnnotationRange, defaultChartPadding } from 'layerchart';
	import { scaleUtc } from 'd3-scale';
	import { formatDisplayDate, type UTCDate } from '$lib/date';
	import type { MultiSeriesDataPoint } from '../types';

	let {
		title,
		data,
		series,
		xDomain,
		missingDataRanges = [],
		xKey = 'createdAt',
		timezone = 'UTC'
	}: {
		title: string;
		data: MultiSeriesDataPoint[];
		series: { key: string; color: string; strokeWidth?: number }[];
		xDomain: UTCDate[];
		missingDataRanges?: [Date, Date][];
		xKey?: string;
		timezone?: string;
	} = $props();

	const xFormat = (date: UTCDate | number) => {
		return formatDisplayDate(date, {
			weekday: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			hour12: false,
			timeZone: timezone
		});
	};
</script>

<h2>{title}</h2>

{#if data === undefined}
	<p>Loading...</p>
{:else if data.length === 0}
	<p>No data to display</p>
{:else}
	<LineChart
		{data}
		x={xKey}
		y={series.map((s) => s.key)}
		xScale={scaleUtc()}
		{xDomain}
		props={{
			xAxis: { format: xFormat, tickSpacing: 100 }
		}}
		{series}
		padding={defaultChartPadding()}
		height={300}
	>
		{#snippet belowMarks()}
			{#each missingDataRanges as range (range[0].getTime())}
				<AnnotationRange
					x={[range[0], range[1]]}
					pattern={{
						size: 8,
						lines: {
							rotate: -45,
							opacity: 0.2
						}
					}}
				/>
			{/each}
		{/snippet}
	</LineChart>
{/if}
