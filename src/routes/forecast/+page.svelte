<script>
	import {
		ForecastDateSelector,
		getEnvironmentState,
		PollenSelector,
		calculateMissingDataRanges,
		toMultiSeriesPollenData,
		toPollenGraphSeries
	} from '$lib/environment';
	import { MultiSeriesLineGraph } from '$lib/graphs';

	const environmentData = getEnvironmentState();
	const series = $derived(toPollenGraphSeries(environmentData.selectedPollenTypes));
	const pollenForecastByType = $derived(
		environmentData.forecast.data
			? toMultiSeriesPollenData(environmentData.forecast.data, environmentData.selectedPollenTypes)
			: []
	);
	const xDomain = $derived([environmentData.forecast.from, environmentData.forecast.to]);
	const missingForecastRanges = $derived(
		environmentData.forecast.data
			? calculateMissingDataRanges(
					environmentData.forecast.data,
					environmentData.selectedPollenTypes,
					environmentData.forecast.from,
					environmentData.forecast.to
				)
			: []
	);
</script>

<h2>Forecast</h2>
<PollenSelector />
<ForecastDateSelector />
<MultiSeriesLineGraph
	title="Pollen Forecast"
	data={pollenForecastByType}
	{series}
	timezone={environmentData.forecast.data?.timezone}
	{xDomain}
	missingDataRanges={missingForecastRanges}
/>
