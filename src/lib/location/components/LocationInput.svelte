<script lang="ts">
	import { getLocationService } from '../locationContext';
	import { locationState } from '../locationState.svelte';
	import { isGeolocationPermissionError } from '../utils';
	import { getSettingsContext } from '$lib/settings';
	import { handleError } from '$lib/errors';
	import { getLoggingService } from '$lib/logging';
	import type { UserLocation } from '../types';

	const service = getLocationService();
	const settings = getSettingsContext();
	const logger = getLoggingService();
	let loading = $state<boolean>(false);
	let searching = $state<boolean>(false);
	let searchFinished = $state<boolean>(false);
	let query = $state<string>('');

	const locationPermission = $derived(settings.locationPermission);

	async function handleGPS() {
		loading = true;

		clearSearchInput();

		try {
			locationState.currentLocation = await service.getBrowserLocation();
		} catch (err: unknown) {
			if (!isGeolocationPermissionError(err)) {
				handleError({
					error: err,
					operation: 'handleGPS',
					logger,
					show: true
				});
			}
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
			handleError({
				error: err,
				operation: 'handleSearch',
				logger,
				show: true
			});
			locationState.searchResults = [];
		} finally {
			searching = false;
			searchFinished = true;
		}
	}

	function selectSearchResult(location: UserLocation) {
		locationState.currentLocation = location;
		clearSearchInput();
	}

	function clearSearchInput() {
		locationState.searchResults = [];
		query = '';
	}

	// Handle saved locations feature
	const isCurrentLocationSaved = $derived(
		locationState.currentLocation
			? settings.current.savedLocations.some(
					(loc) =>
						loc.coordinates.latitude === locationState.currentLocation?.coordinates.latitude &&
						loc.coordinates.longitude === locationState.currentLocation?.coordinates.longitude
				)
			: false
	);

	function saveCurrentLocation() {
		// Is there a location?
		if (!locationState.currentLocation) {
			return;
		}
		// Is the location already saved?
		if (isCurrentLocationSaved) {
			return;
		}
		// Save the location

		const updatedSavedLocations = [
			...settings.current.savedLocations,
			locationState.currentLocation
		];
		settings.update('savedLocations', updatedSavedLocations);
	}

	function removeSavedLocation(loc: UserLocation) {
		const updatedSavedLocations = settings.current.savedLocations.filter(
			(item) =>
				item.coordinates.latitude !== loc.coordinates.latitude ||
				item.coordinates.longitude !== loc.coordinates.longitude
		);
		settings.update('savedLocations', updatedSavedLocations);
	}

	function loadSavedLocation(loc: UserLocation) {
		locationState.currentLocation = loc;
	}
</script>

<section>
	{#if locationPermission === 'denied'}
		<p class="error">
			Browser location access is denied. Please enable it in your browser settings to use GPS.
		</p>
	{/if}

	{#if locationState.currentLocation}
		<div>
			<span>
				📍 {locationState.currentLocation.label}
			</span>
			<button onclick={() => (locationState.currentLocation = null)}> ✕ </button>
			<button onclick={saveCurrentLocation} disabled={isCurrentLocationSaved}
				>{isCurrentLocationSaved ? ' ★ Saved' : ' ☆ Save'}</button
			>
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

	<!-- Saved Locations -->
	{#if settings.current.savedLocations.length > 0}
		<div>
			<strong>Saved Locations</strong>
			<ul>
				{#each settings.current.savedLocations as savedLoc, i (i)}
					<li>
						<button onclick={() => loadSavedLocation(savedLoc)}>{savedLoc.label}</button>
						<button onclick={() => removeSavedLocation(savedLoc)}> ✕ </button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</section>
