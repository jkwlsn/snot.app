<script lang="ts">
	import { getLocationService, locationState } from '$lib/location';
	import { createLogger, consoleProvider } from '$lib/logging';
	import type { UserLocation } from '$lib/types';

	const logger = createLogger(consoleProvider);
	const service = getLocationService();

	let error = $state<Error | null>(null);
	let loading = $state<boolean>(false);
	let searching = $state<boolean>(false);
	let searchFinished = $state<boolean>(false);
	let query = $state<string>('');
	let results = $state<UserLocation[]>([]);

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

	async function handleSearch(query: string) {
		const context = { module: 'location', function: 'handleSearch' };
		const q = query.trim();

		if (!q) {
			results = [];
			logger.warn('No search query supplied', { ...context, query: q });
			return;
		}

		error = null;
		searching = true;
		searchFinished = false;

		logger.debug('Attempting to search for location', { ...context, query: q });

		try {
			results = await service.forwardGeocode(q);

			if (!results) {
				logger.warn('No results for query', { ...context, query: q, results });
			}

			logger.info('Search results', { ...context, query: q, results });
		} catch (err) {
			error = err instanceof Error ? err : new Error(String(err));
			logger.error(error.message, { ...context, error });
			throw err;
		} finally {
			searching = false;
			searchFinished = true;
		}
	}

	function selectSearchResult(location: UserLocation) {
		locationState.currentLocation = location;
		results = [];
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
				if (!query) results = [];
			}}
			onkeydown={(e) => e.key === 'Enter' && handleSearch(query)}
		/>
		<button onclick={() => handleSearch(query)} disabled={searching || query.length < 3}>
			{searching ? 'Searching…' : 'Search'}
		</button>
		{#if query.length > 0 && results.length > 0}
			<ul role="listbox">
				{#each results as result, i (i)}
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

	<!-- Error -->
	{#if error}
		<p role="alert">
			{error.message}
		</p>
	{/if}
</section>
