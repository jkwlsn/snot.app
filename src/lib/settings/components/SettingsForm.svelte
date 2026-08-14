<script lang="ts">
	import ThemeInput from './ThemeInput.svelte';
	import SettingsFieldset from './SettingsFieldset.svelte';
	import { LocationInput } from '$lib/location';
	import { getSettingsContext } from '$lib/settings';
	import { SeverityThresholdInput } from '$lib/environment';

	const settings = getSettingsContext();
</script>

<form onreset={() => settings.reset()}>
	<SettingsFieldset title="Location">
		<LocationInput />
	</SettingsFieldset>

	<SettingsFieldset title="Appearance">
		<ThemeInput />
	</SettingsFieldset>

	<SettingsFieldset title="Minimum Severity">
		<SeverityThresholdInput />
	</SettingsFieldset>

	<button type="reset">Reset to default</button>
</form>
