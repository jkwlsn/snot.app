<script lang="ts">
	import { getPollenName, getPollenUnit } from '$lib/environment';
	import type { PollenSeverityNotification } from '../types';

	let { notifications }: { notifications: PollenSeverityNotification[] } = $props();
</script>

<h2>Current Severity Indicator</h2>
{#if !notifications}
	<p>Loading...</p>
{:else if notifications.length === 0}
	<p>No pollen metrics above the threshold.</p>
{:else}
	<div>
		{#each notifications as item (item.pollen)}
			<div class="flex gap-2 p-2 border-b">
				<span>{item.severity.symbol}</span>
				<span>{item.severity.level}</span>
				<span>{getPollenName(item.pollen)}</span>
				<span>{item.value.toFixed(1)}</span>
				<span>{getPollenUnit(item.unit)}</span>
				<span>{item.severity.description}</span>
			</div>
		{/each}
	</div>
{/if}
