<script lang="ts">
	import { getLocationService, locationState } from '$lib/location';
	import { handleError } from '$lib/errors';
	import { createLogger, consoleProvider } from '$lib/logging';
	import type { UserLocation } from '$lib/types';

	const service = getLocationService();
	const logger = createLogger(consoleProvider);

	let loading = $state<boolean>(false);
	let searching = $state<boolean>(false);
	let searchFinished = $state<boolean>(false);
	let query = $state<string>('');

	async function handleGPS() {
		loading = true;

		try {
			locationState.currentLocation = await service.getBrowserLocation();
		} catch (err) {
			handleError(err, 'handleGPS', { logger, show: true });
		} finally {
			loading = false;
		}
	}

	async function handleSearch(query: string) {
		const q = query.trim();

		if (!q) {
			locationState.searchResults = [];
			return;
		}

		searching = true;
		searchFinished = false;

		try {
			locationState.searchResults = await service.forwardGeocode(q);
		} catch (err) {
			handleError(err, 'handleSearch', { logger, show: true });
			locationState.searchResults = [];
		} finally {
			searching = false;
			searchFinished = true;
		}
	}

	function selectSearchResult(location: UserLocation) {
		locationState.currentLocation = location;
		locationState.searchResults = [];
		query = '';
		searchFinished = false;
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

	<!-- Text search and selector -->
	<div>
		<input
			type="search"
			placeholder="Search a location…"
			bind:value={query}
			disabled={searching}
			oninput={() => {
				searchFinished = false;
				if (!query) locationState.searchResults = [];
			}}
			onkeydown={(e) => e.key === 'Enter' && handleSearch(query)}
		/>
		<button onclick={() => handleSearch(query)} disabled={searching || query.length < 3}>
			{searching ? 'Searching…' : 'Search'}
		</button>
		{#if query.length > 0 && locationState.searchResults.length > 0}
			<ul role="listbox">
				{#each locationState.searchResults as result, i (i)}
					<li>
						<button onclick={() => selectSearchResult(result)}>
							{result.label}
						</button>
					</li>
				{/each}
			</ul>
		{:else if searchFinished && !searching && query.length > 0}
			<p>No results found for "{query}"</p>
		{/if}
	</div>
</section>
