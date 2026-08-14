<script lang="ts">
	import SeverityThresholdInput from '$lib/environment/severity/components/SeverityThresholdInput.svelte';
	import { getSettingsContext } from '$lib/settings';

	const settings = getSettingsContext();

	function handleThemeChange(event: Event) {
		const target = event.currentTarget as HTMLSelectElement;
		settings.update('theme', target.value as 'light' | 'dark' | 'system');
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

	<SeverityThresholdInput />

	<button type="reset">Reset to default</button>
</form>
