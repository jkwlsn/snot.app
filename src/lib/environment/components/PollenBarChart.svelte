<script lang="ts">
	import { BarChart } from 'layerchart';
	import { format, startOfHour } from 'date-fns';
	import { scaleBand } from 'd3-scale';
	import { timeHour } from 'd3-time';
	import { OPENMETEO_CONFIG } from '../providers/config';
	import type { TemporalDataPoint } from '$lib/types';

	let {
		data,
		title
	}: {
		data: TemporalDataPoint[];
		title?: string;
	} = $props();

	// Generate the full domain of hours for the forecast period (96 hours)
	const xDomain = $derived.by(() => {
		const start = startOfHour(new Date());
		const end = timeHour.offset(start, OPENMETEO_CONFIG.maxForecastDays * 24);
		return timeHour.range(start, end);
	});

	// Only show ticks for 00:00 and 12:00
	const ticks = $derived(xDomain.filter((d) => d.getHours() === 0 || d.getHours() === 12));
	// ...

	const formatTick = (d: Date) => {
		if (d.getHours() === 0) {
			return format(d, 'MMM dd');
		}
		return format(d, 'HH:mm');
	};
</script>

{#if title}
	<h2>{title}</h2>
{/if}

{#if data && data.length > 0}
	<BarChart
		{data}
		x="createdAt"
		xScale={scaleBand()
			.domain(xDomain.map((d) => d.toISOString()))
			.padding(0.5)}
		y="value"
		height={300}
		padding={{ top: 10, right: 10, bottom: 30, left: 30 }}
		props={{
			xAxis: {
				ticks,
				tickMultiline: true,
				format: formatTick
			},
			bars: { rounded: 'top' }
		}}
	/>
{:else}
	<p>No data available for the selected range.</p>
{/if}
