<script lang="ts">
	import { getLocationService } from '$lib/location/context';
	import { locationState } from '$lib/location/state.svelte';
	import { logger } from '$lib/logger';

	const service = getLocationService();

	let error = $state<Error | null>(null);
	let loading = $state<boolean>(false);

	async function handleGPS() {
		const context = { module: 'location', function: 'handleGPS' };

		loading = true;
		error = null;

		try {
			locationState.currentLocation = await service.getBrowserLocation();
			logger.debug('Set currentLocation', {
				...context,
				currentLocation: locationState.currentLocation
			});
		} catch (err) {
			error = err instanceof Error ? err : new Error(String(err));
			logger.error(error.message, { ...context, error });
		} finally {
			loading = false;
		}
	}
</script>

<section>
	{#if locationState.currentLocation}
		<div>
			<span>
				📍 {locationState.currentLocation.label}
			</span>
			<button onclick={() => (locationState.currentLocation = null)}> ✕ </button>
		</div>
	{:else}
		<p>No location set</p>
	{/if}

	<!-- GPS -->
	<div>
		<button onclick={handleGPS} disabled={loading}>
			{loading ? 'Locating…' : '📡 Use GPS'}
		</button>
	</div>

	<!-- Error -->
	{#if error}
		<p role="alert">
			{error.message}
		</p>
	{/if}
</section>
