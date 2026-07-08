<script lang="ts">
	import { consoleProvider, createLoggingService, setLoggingService } from '$lib/logging';

	import { createSettingsService, createSettingsState, setSettingsContext } from '$lib/settings';

	// Import location context and service
	import { createLocationService, setLocationService, locationState } from '$lib/location';

	// Import environment context and service
	import {
		createEnvironmentService,
		setEnvironmentService,
		createEnvironmentState,
		setEnvironmentState
	} from '$lib/environment';
	import { createOpenmeteoProvider } from '$lib/environment/providers/openmeteoProvider';
	import { createOpenmeteoTransformer } from '$lib/environment/providers/openmeteoTransformer';

	// PWA
	import '$lib/pwa/pwa.svelte';
	import { ErrorDisplay } from '$lib/errors';
	import {
		createEntryService,
		createEntryState,
		setEntryService,
		setEntryState
	} from '$lib/entries';

	// Init
	const logger = createLoggingService({
		provider: consoleProvider,
		minLevel: import.meta.env.PROD ? 'info' : 'debug'
	});
	setLoggingService(logger);

	const settingsService = createSettingsService({ logger });
	setSettingsContext(createSettingsState({ service: settingsService }));

	const environmentService = createEnvironmentService({
		logger,
		provider: createOpenmeteoProvider(),
		transformer: createOpenmeteoTransformer()
	});
	setEnvironmentService(environmentService);

	const environmentState = createEnvironmentState({
		service: environmentService,
		locationState: locationState
	});
	setEnvironmentState(environmentState);

	const entryService = createEntryService({
		logger,
		locationState,
		environmentState,
		settingsService
	});
	setEntryService(entryService);

	const locationService = createLocationService({ logger: logger });
	setLocationService(locationService);

	// Entry data
	setEntryState(createEntryState({ service: entryService, logger }));

	let { children } = $props();
</script>

<svelte:head>
	<title>snot.app</title>
	<meta name="description" content="My Awesome App description" />
</svelte:head>

<h1>snot.app</h1>

<nav>
	<menu>
		<li><a href="/">Overview</a></li>
		<li><a href="/forecast">Forecast</a></li>
		<li><a href="/history">History</a></li>
		<li><a href="/settings">Settings</a></li>
	</menu>
</nav>

<ErrorDisplay />

{@render children()}
