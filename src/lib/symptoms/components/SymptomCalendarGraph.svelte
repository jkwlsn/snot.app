<script lang="ts">
	import { scaleThreshold } from 'd3-scale';
	import { startOfYear, endOfDay } from 'date-fns';
	import { Calendar, Chart, Layer, Rect, Tooltip } from 'layerchart';
	import { format, PeriodType } from '@layerstack/utils';
	import { createLayerchartCalendarGraph as provider } from '$lib/symptoms';
	import type { SymptomLog } from '$lib/symptoms';
	import type { TemporalDataPoint } from '$lib/types';

	interface Props {
		title: string;
		records: SymptomLog[];
	}

	let { records, title }: Props = $props();

	const now = new Date();
	const start = startOfYear(now);
	const end = endOfDay(now);

	const chart = $derived.by(() => {
		const data = provider.transform(records ?? []);
		const max = data.length > 0 ? Math.max(...data.map((d: TemporalDataPoint) => d.value)) : 10;
		const cDomain = [Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75)];
		return { data, cDomain };
	});
</script>

<section>
	<h2>{title}</h2>
	{#if records?.length === 0}
		<p>No data</p>
	{:else if records === undefined}
		<p>Loading</p>
	{:else}
		<Chart
			data={chart.data}
			x="createdAt"
			c="value"
			cScale={scaleThreshold()}
			cDomain={chart.cDomain}
			cRange={[
				'oklch(90% 0.15 100)',
				'oklch(78% 0.18 60)',
				'oklch(62% 0.20 35)',
				'oklch(48% 0.22 20)'
			]}
			padding={{ top: 20 }}
			height={140}
		>
			{#snippet children({ context })}
				<Layer>
					<Calendar {start} {end}>
						{#snippet children({ cells, cellSize })}
							{#each cells as cell, i (i)}
								{@const padding = 1}
								<Rect
									x={cell.x + padding}
									y={cell.y + padding}
									width={cellSize[0] - padding * 2}
									height={cellSize[1] - padding * 2}
									rx={4}
									fill={cell.color ?? 'rgb(0 0 0 / 5%)'}
									onpointermove={(e) => context.tooltip?.show(e, cell.data)}
									onpointerleave={() => context.tooltip?.hide()}
								/>
							{/each}
						{/snippet}
					</Calendar>
				</Layer>

				<Tooltip.Root>
					{#snippet children({ data })}
						{#if data?.value != null}
							<Tooltip.Header>{format(data.createdAt, PeriodType.Day)}</Tooltip.Header>
							<Tooltip.List>
								<Tooltip.Item
									label="Symptoms"
									value={data.value}
									format="integer"
									valueAlign="right"
								/>
							</Tooltip.List>
						{:else}
							No Data
						{/if}
					{/snippet}
				</Tooltip.Root>
			{/snippet}
		</Chart>
	{/if}
</section>
