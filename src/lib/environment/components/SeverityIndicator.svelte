<script lang="ts">
	import { toSeverityIndicatorData } from '../adapters/severityIndicatorAdapter.ts';
	import { filterPollenByMetricValue } from '../utils/pollen.ts';
	import type { PollenSeries } from '../types';

	let { data, minValue = 0 }: { data?: PollenSeries; minValue?: number } = $props();

	const severityData = $derived.by(() => {
		if (!data) return null;
		const filteredData = filterPollenByMetricValue(data, minValue);
		return toSeverityIndicatorData(filteredData);
	});
</script>

<h2>Current Severity Indicator</h2>
{#if !data}
	<p>Loading or no data available.</p>
{:else if severityData && severityData.severityInstant.length === 0}
	<p>No pollen metrics above the threshold.</p>
{:else if severityData}
	<div>
		{#each severityData.severityInstant as item (item.name)}
			<div class="flex gap-2 p-2 border-b">
				<span>{item.name}</span>
				<span>{item.severityName}</span>
				<span>{item.symbol}</span>
				<span>{item.value}</span>
				<span>{item.unit}</span>
				<span>{item.description}</span>
			</div>
		{/each}
	</div>
{/if}
