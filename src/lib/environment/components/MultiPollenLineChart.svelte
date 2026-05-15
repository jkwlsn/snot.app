<script lang="ts">
	import { LineChart, AnnotationRange, defaultChartPadding } from 'layerchart';
	import { scaleTime } from 'd3-scale';
	import { startOfHour } from 'date-fns';
	import { timeHour } from 'd3-time';
	import { OPENMETEO_CONFIG } from '../providers/config';
	import { calculateMissingDataRanges } from '../utils/chart';
	import { getEnvironmentState } from '$lib/environment';
	import { toMultiPollenLineChartData } from '$lib/environment/adapters/multiPollenLineChartAdapter';
	import type { PollenSeries } from '../types';

	let { data }: { data?: PollenSeries } = $props();

	const env = getEnvironmentState();
	const seriesData = $derived(data ?? env.forecast.data);

	const xDomain = $derived.by(() => {
		const start = startOfHour(new Date());
		const end = timeHour.offset(start, 24 * OPENMETEO_CONFIG.maxForecastDays);
		return [start, end];
	});

	const colors = [
		'#e41a1c',
		'#377eb8',
		'#4daf4a',
		'#984ea3',
		'#ff7f00',
		'#ffff33',
		'#a65628',
		'#f781bf',
		'#999999'
	];

	const series = $derived(
		env.selectedPollenTypes.map((type, index) => ({
			key: type,
			color: colors[index % colors.length],
			strokeWidth: 2
		}))
	);

	const chartData = $derived.by(() => {
		if (!seriesData) return [];
		return toMultiPollenLineChartData(seriesData, env.selectedPollenTypes);
	});

	const missingDataRanges = $derived(
		calculateMissingDataRanges(seriesData, env.selectedPollenTypes, xDomain[0], xDomain[1])
	);
</script>

<h2>Pollen Forecast</h2>

{#if seriesData && chartData.length > 0 && series.length > 0}
	<LineChart
		data={chartData}
		x="createdAt"
		y={series.map((s) => s.key)}
		xScale={scaleTime().domain(xDomain)}
		{series}
		padding={defaultChartPadding()}
		height={300}
	>
		{#snippet belowMarks()}
			{#each missingDataRanges as range (range[0].toISOString())}
				<AnnotationRange
					x={range}
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
{:else}
	<p>Select pollen types to view the forecast.</p>
{/if}
