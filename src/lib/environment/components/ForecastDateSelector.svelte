<script lang="ts">
	import { parseISO, addHours } from 'date-fns';
	import { OPENMETEO_CONFIG } from '../providers/config';
	import { toDateTimeInput } from '../utils/date';
	import { getEnvironmentState } from '$lib/environment';

	const env = getEnvironmentState();

	function updateFrom(e: Event) {
		const target = e.target as HTMLInputElement;
		const newFrom = parseISO(target.value);

		// Enforce: FROM < TO (with 1h min interval)
		if (newFrom >= env.forecast.to) {
			env.forecast.to = addHours(newFrom, 1);
		}

		env.forecast.from = newFrom;
	}

	function updateTo(e: Event) {
		const target = e.target as HTMLInputElement;
		const newTo = parseISO(target.value);

		// Enforce: TO > FROM (with 1h min interval)
		if (newTo <= env.forecast.from) {
			env.forecast.from = addHours(newTo, -1);
		}

		env.forecast.to = newTo;
	}

	// Constraints for UI
	const now = new Date();
	const absoluteMax = addHours(now, OPENMETEO_CONFIG.maxForecastDays * 24);

	const fromMin = toDateTimeInput(now);
	const fromMax = $derived(toDateTimeInput(addHours(env.forecast.to, -1)));

	const toMin = $derived(toDateTimeInput(addHours(env.forecast.from, 1)));
	const toMax = toDateTimeInput(absoluteMax);
</script>

<fieldset>
	<legend>Forecast Date Range</legend>
	<label>
		From:
		<input
			type="datetime-local"
			value={toDateTimeInput(env.forecast.from)}
			onchange={updateFrom}
			min={fromMin}
			max={fromMax}
		/>
	</label>
	<label>
		To:
		<input
			type="datetime-local"
			value={toDateTimeInput(env.forecast.to)}
			onchange={updateTo}
			min={toMin}
			max={toMax}
		/>
	</label>
</fieldset>
