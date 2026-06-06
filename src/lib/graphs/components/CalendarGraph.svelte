<script lang="ts">
	import { scaleThreshold } from 'd3-scale';
	import { Calendar, Chart, Layer, Rect, Tooltip } from 'layerchart';
	import { format, PeriodType, type FormatType } from '@layerstack/utils';
	import { endOfDay, startOfYear } from 'date-fns';
	import type { TemporalDataPoint } from '$lib/graphs';

	let {
		title,
		data,
		cDomain,
		cRange = [
			'oklch(90% 0.15 100)',
			'oklch(78% 0.18 60)',
			'oklch(62% 0.20 35)',
			'oklch(48% 0.22 20)'
		],
		start = startOfYear(new Date()),
		end = endOfDay(new Date()),
		xKey = 'createdAt',
		cKey,
		valueLabel = 'Count',
		valueFormat = 'integer'
	}: {
		title: string;
		data: TemporalDataPoint[] | undefined;
		cDomain: number[];
		cRange?: string[];
		start?: Date;
		end?: Date;
		xKey?: string;
		cKey?: string;
		valueLabel?: string;
		valueFormat?: FormatType;
	} = $props();
</script>

<section>
	<h2>{title}</h2>
	{#if data === undefined}
		<p>Loading...</p>
	{:else if data.length === 0}
		<p>No data</p>
	{:else}
		<Chart {data} x={xKey} c={cKey} cScale={scaleThreshold()} {cDomain} {cRange} height={140}>
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
						<Tooltip.Header>{format(data.createdAt, PeriodType.Day)}</Tooltip.Header>
						{#if data?.value != null}
							<Tooltip.List>
								<Tooltip.Item
									label={valueLabel}
									value={data.value}
									format={valueFormat}
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
