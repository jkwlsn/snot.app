<script lang="ts">
	import { LineChart, AnnotationRange, defaultChartPadding } from 'layerchart';
	import { scaleUtc } from 'd3-scale';
	import { calculateMissingDataRanges } from '../utils/chart';
	import { formatDisplayDate, type UTCDate } from '$lib/date';
	import { getEnvironmentState } from '$lib/environment';

	import { toMultiPollenLineChartData } from '$lib/environment/adapters/multiPollenLineChartAdapter';
	import type { EnvironmentObservation } from '../types';

	let { data }: { data?: EnvironmentObservation[] } = $props();

	const env = getEnvironmentState();
	const seriesData = $derived(data ?? env.forecast.data);

	const xDomain = $derived.by((): [UTCDate, UTCDate] => {
		// Use user-selected forecast range for axis domain
		return [env.forecast.from, env.forecast.to];
	});

	const xFormat = (date: UTCDate | number) => {
		const timezone = env.forecast.timezone ?? 'UTC';

		return formatDisplayDate(date, {
			weekday: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			hour12: false,
			timeZone: timezone
		});
	};

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
{:else}
	<p>Select pollen types to view the forecast.</p>
{/if}
