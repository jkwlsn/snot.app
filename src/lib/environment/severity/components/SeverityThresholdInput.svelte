<script lang="ts">
	import { MAX_SEVERITY, MIN_SEVERITY } from '../config';
	import { getPollenSeverity } from '../calculator';
	import { getSettingsContext } from '$lib/settings';

	const settings = getSettingsContext();

	let severityLevel = $state(settings.current.pollenSeverityLevel);

	let pollenSeverity = $derived(getPollenSeverity(severityLevel));

	const minSeverityThreshold = MIN_SEVERITY;
	const maxSeverityThreshold = MAX_SEVERITY;

	$effect(() => {
		settings.update('pollenSeverityLevel', severityLevel);
	});
</script>

<label for="severity-threshold-slider">Select minimum severity</label>
<input
	type="range"
	id="severity-threshold-slider"
	max={maxSeverityThreshold}
	min={minSeverityThreshold}
	step={1}
	bind:value={severityLevel}
/>
<output>{pollenSeverity.level}</output>
