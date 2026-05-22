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
<MultiPollenLineChart data={environmentData.forecast.data} />
