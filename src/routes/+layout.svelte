<script lang="ts">
	import '$lib/pwa/pwa.svelte';
	// Import location context and service
	import { setLocationService } from '$lib/location/context';
	import { createLocationService } from '$lib/location/service';

	// Symptom Service
	import { setSymptomService } from '$lib/services/context';
	import { createSymptomService } from '$lib/services/symptoms';
	import { symptomRepository } from '$lib/db/repository';

	import { browserGeolocationProvider } from '$lib/location/providers/browserGeolocation';
	import { nominatimGeocodeProvider } from '$lib/location/providers/nominatimGeocodeProvider';
	import { createLogger, consoleProvider } from '$lib/logging';

	const logger = createLogger(consoleProvider);

	setSymptomService(createSymptomService(symptomRepository, logger));

	setLocationService(
		createLocationService({
			geolocation: browserGeolocationProvider(logger),
			geocode: nominatimGeocodeProvider(logger),
			logger: logger
		})
	);

	let { children } = $props();
</script>

<svelte:head>
	<title>My Awesome App</title>
	<meta name="description" content="My Awesome App description" />
</svelte:head>

{@render children()}
