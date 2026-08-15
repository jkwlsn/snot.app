<script lang="ts">
	import { getSettingsContext } from '$lib/settings';

	const settings = getSettingsContext();

	function handleThemeChange(event: Event) {
		const target = event.currentTarget as HTMLSelectElement;
		settings.update('theme', target.value as 'light' | 'dark' | 'system');
	}
</script>

<label for="app-theme">Theme</label>
<select id="app-theme" value={settings.current.theme} onchange={handleThemeChange}>
	<option value="system">System</option>
	<option value="light">Light</option>
	<option value="dark">Dark</option>
</select>
