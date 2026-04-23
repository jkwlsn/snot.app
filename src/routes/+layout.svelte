<script lang="ts">
	// Logger
	import { createLogger, consoleProvider } from '$lib/logging';

	// Symptom Repository
	import { setSymptomRepository } from '$lib/db/repository/context';
	import { createSymptomRepository } from '$lib/db/repository/symptoms';

	// Symptom Service
	import { setSymptomService } from '$lib/services/context';
	import { createSymptomService } from '$lib/services/symptoms';

	// Import location context and service
	import { setLocationService } from '$lib/location/context';
	import { createLocationService } from '$lib/location/service';
	import { browserGeolocationProvider } from '$lib/location/providers/browserGeolocation';
	import { nominatimGeocodeProvider } from '$lib/location/providers/nominatimGeocodeProvider';

	// PWA
	import '$lib/pwa/pwa.svelte';

	// State & Context
	import { createSymptomsState } from '$lib/state/symptoms.svelte';
	import { setSymptomsContext } from '$lib/state/context';

	// Init
	const logger = createLogger(consoleProvider);

	const symptomRepository = createSymptomRepository(logger);
	setSymptomRepository(symptomRepository);

	const symptomService = createSymptomService(symptomRepository);
	setSymptomService(symptomService);

	const locationService = createLocationService({
		geolocation: browserGeolocationProvider(),
		geocode: nominatimGeocodeProvider(),
		logger: logger
	});
	setLocationService(locationService);

	// Symptoms Data
	setSymptomsContext(createSymptomsState(symptomService));

	let { children } = $props();
</script>

<svelte:head>
	<title>My Awesome App</title>
	<meta name="description" content="My Awesome App description" />
</svelte:head>

{@render children()}
