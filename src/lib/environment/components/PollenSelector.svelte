<script lang="ts">
	import { getEnvironmentState } from '$lib/environment';
	import { getPollenName } from '$lib/environment/utils';
	import type { PollenType } from '$lib/environment/types';

	const env = getEnvironmentState();

	function togglePollen(pollenId: PollenType) {
		const index = env.selectedPollenTypes.indexOf(pollenId);
		if (index > -1) {
			env.selectedPollenTypes.splice(index, 1);
		} else {
			env.selectedPollenTypes.push(pollenId);
		}
	}
</script>

<fieldset>
	<legend>Pollen Types</legend>
	{#each env.supportedPollenTypes as pollenId (pollenId)}
		<label>
			<input
				type="checkbox"
				checked={env.selectedPollenTypes.includes(pollenId)}
				onchange={() => togglePollen(pollenId)}
			/>
			{getPollenName(pollenId)}
		</label>
	{/each}
</fieldset>
