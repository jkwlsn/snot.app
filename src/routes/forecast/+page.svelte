<script>
	import {
		ForecastDateSelector,
		getEnvironmentState,
		MultiPollenLineChart,
		PollenSelector
	} from '$lib/environment';
	import { locationState } from '$lib/location';

	const environmentData = getEnvironmentState();
</script>

<h2>Forecast</h2>
<PollenSelector />
<ForecastDateSelector />
{#if locationState.currentLocation}
	<MultiPollenLineChart
		data={environmentData.forecast.data}
		selectedPollenTypes={environmentData.selectedPollenTypes}
		from={environmentData.forecast.from}
		to={environmentData.forecast.to}
		timezone={environmentData.forecast.timezone}
	/>
{:else}
	<p>Set a location to view pollen forecast.</p>
{/if}
