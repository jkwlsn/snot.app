<script lang="ts">
	import SeverityThresholdInput from '$lib/environment/severity/components/SeverityThresholdInput.svelte';
	import { getSettingsContext } from '$lib/settings';

	const settings = getSettingsContext();

	function handleThemeChange(event: Event) {
		const target = event.currentTarget as HTMLSelectElement;
		settings.update('theme', target.value as 'light' | 'dark' | 'system');
	}

	function handleLocationChange(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		settings.update('locationEnabled', target.checked);
	}
</script>

<form onreset={() => settings.reset()}>
	<h2>Settings</h2>
	<fieldset>
		<legend>Appearance</legend>
		<select id="app-theme" value={settings.current.theme} onchange={handleThemeChange}>
			<option value="system">System</option>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>
		<label for="app-theme">Set app theme</label>
	</fieldset>

	<fieldset>
		<legend>Location</legend>
		<input
			type="checkbox"
			id="location-enabled"
			checked={settings.current.locationEnabled}
			onchange={handleLocationChange}
		/>
		<label for="location-enabled">Enable Location Tracking</label>
		{#if settings.current.locationEnabled && settings.locationPermission === 'denied'}
			<p>Note: Location access is currently denied in your browser settings.</p>
		{/if}
	</fieldset>

	<SeverityThresholdInput />

	<button type="reset">Reset to default</button>
</form>
