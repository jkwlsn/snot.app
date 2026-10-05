<script>
  import {
    ForecastDateSelector,
    getEnvironmentState,
    MultiPollenLineChart,
  } from "$lib/environment";
  import { getLocationState } from "$lib/location";

  const environmentData = getEnvironmentState();
  const locationState = getLocationState();
</script>

<h2>Forecast</h2>
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
