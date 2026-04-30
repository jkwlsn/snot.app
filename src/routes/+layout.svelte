<script lang="ts">
	import { consoleProvider, createLoggingService, setLoggingService } from '$lib/logging';

	import {
		setSymptomRepository,
		createSymptomRepository,
		setSymptomService,
		createSymptomService,
		setSymptomState,
		createSymptomState
	} from '$lib/symptoms';

	// Import location context and service
	import { createLocationService, setLocationService, locationState } from '$lib/location';
	import { browserGeolocationProvider } from '$lib/location/providers/browserGeolocation';
	import { nominatimGeocodeProvider } from '$lib/location/providers/nominatimGeocodeProvider';

	// PWA
	import '$lib/pwa/pwa.svelte';

	// Init
	const logger = createLoggingService({
		provider: consoleProvider,
		minLevel: import.meta.env.PROD ? 'info' : 'debug'
	});
	setLoggingService(logger);

	const symptomRepository = createSymptomRepository(logger);
	setSymptomRepository(symptomRepository);

	const symptomService = createSymptomService(symptomRepository, locationState);
	setSymptomService(symptomService);

	const locationService = createLocationService({
		geolocation: browserGeolocationProvider(),
		geocode: nominatimGeocodeProvider(),
		logger: logger
	});
	setLocationService(locationService);

	// Symptoms Data
	setSymptomState(createSymptomState(symptomService, logger));

	let { children } = $props();
</script>

<svelte:head>
	<title>My Awesome App</title>
	<meta name="description" content="My Awesome App description" />
</svelte:head>

{@render children()}
