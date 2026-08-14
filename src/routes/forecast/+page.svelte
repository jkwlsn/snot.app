<script>
	import {
		ForecastDateSelector,
		getEnvironmentState,
		MultiPollenLineChart,
		PollenSelector
	} from '$lib/environment';

	const environmentData = getEnvironmentState();
</script>

<h2>Forecast</h2>
<PollenSelector />
<ForecastDateSelector />
<MultiPollenLineChart
	data={environmentData.forecast.data}
	selectedPollenTypes={environmentData.selectedPollenTypes}
	from={environmentData.forecast.from}
	to={environmentData.forecast.to}
	timezone={environmentData.forecast.timezone}
/>
