<script lang="ts">
	import { consoleProvider, createLoggingService, setLoggingService } from '$lib/logging';

	import {
		setSymptomService,
		createSymptomService,
		setSymptomState,
		createSymptomState
	} from '$lib/symptoms';

	// Import location context and service
	import { createLocationService, setLocationService, locationState } from '$lib/location';

	// PWA
	import '$lib/pwa/pwa.svelte';

	// Init
	const logger = createLoggingService({
		provider: consoleProvider,
		minLevel: import.meta.env.PROD ? 'info' : 'debug'
	});
	setLoggingService(logger);

	const symptomService = createSymptomService({
		logger,
		locationState: locationState
	});
	setSymptomService(symptomService);

	const locationService = createLocationService({ logger: logger });
	setLocationService(locationService);

	// Symptoms Data
	setSymptomState(createSymptomState({ service: symptomService, logger }));

	let { children } = $props();
</script>

<svelte:head>
	<title>My Awesome App</title>
	<meta name="description" content="My Awesome App description" />
</svelte:head>

{@render children()}
