<script lang="ts">
	import { OPENMETEO_CONFIG } from '../providers/config';
	import {
		addHoursUTC,
		fromDateTimeLocalToUTC,
		toDateTimeLocalString,
		getUTCNow,
		type UTCDate
	} from '$lib/date';
	import { getEnvironmentState } from '$lib/environment';
	import { getLoggingService } from '$lib/logging';

	const env = getEnvironmentState();
	const logger = getLoggingService();

	// Use forecast timezone if available, otherwise fallback to UTC
	const forecastTimezone = $derived(env.forecast.data?.timezone ?? 'UTC');

	function updateFrom(e: Event) {
		const target = e.target as HTMLInputElement;
		let newFrom = fromDateTimeLocalToUTC(target.value, forecastTimezone);

		logger.debug('ForecastDateSelector - updateFrom', {
			rawValue: target.value,
			parsedUTC: newFrom.toISOString(),
			timezone: forecastTimezone
		});

		// Enforce: FROM < TO (with 1h min interval)
		if (newFrom >= env.forecast.to) {
			env.forecast.to = addHoursUTC(newFrom, 1);
		}

		// Enforce: FROM <= absoluteMax
		if (newFrom > absoluteMax) {
			newFrom = absoluteMax;
		}

		env.forecast.from = newFrom;
	}

	function updateTo(e: Event) {
		const target = e.target as HTMLInputElement;
		const newTo = fromDateTimeLocalToUTC(target.value, forecastTimezone);
		logger.debug('ForecastDateSelector - updateTo', {
			rawValue: target.value,
			parsedUTC: newTo.toISOString(),
			timezone: forecastTimezone
		});

		// Enforce: TO > FROM (with 1h min interval)
		if (newTo <= env.forecast.from) {
			env.forecast.from = addHoursUTC(newTo, -1);
		}

		// Enforce: TO <= absoluteMax
		let finalTo = newTo;
		if (finalTo > absoluteMax) {
			finalTo = absoluteMax;
		}

		env.forecast.to = finalTo;
	}

	// Constraints for UI
	const now = env.forecast.data?.createdAt ?? getUTCNow();
	const absoluteMax = addHoursUTC(now, OPENMETEO_CONFIG.maxForecastDays * 24);

	// Helpers to format dates in the forecast's timezone for the UI
	const toDateTimeLocal = (date: UTCDate) => toDateTimeLocalString(date, forecastTimezone);

	const fromMin = toDateTimeLocal(now);
	const fromMax = $derived(toDateTimeLocal(addHoursUTC(env.forecast.to, -1)));

	const toMin = $derived(toDateTimeLocal(addHoursUTC(env.forecast.from, 1)));
	const toMax = toDateTimeLocal(absoluteMax);
</script>

<fieldset>
	<legend>Forecast Date Range</legend>
	<label>
		From:
		<input
			type="datetime-local"
			value={toDateTimeLocal(env.forecast.from)}
			onchange={updateFrom}
			min={fromMin}
			max={fromMax}
		/>
	</label>
	<label>
		To:
		<input
			type="datetime-local"
			value={toDateTimeLocal(env.forecast.to)}
			onchange={updateTo}
			min={toMin}
			max={toMax}
		/>
	</label>
</fieldset>
