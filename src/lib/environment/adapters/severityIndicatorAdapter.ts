import { POLLEN_LOOKUP, UNIT_LOOKUP } from '../utils/pollen';
import type { PollenSeries, SeverityInstant } from '../types';

export function toSeverityIndicatorData(series: PollenSeries): SeverityInstant {
	if (!series?.instants) {
		return { severityInstant: [] };
	}

	const instant = series.instants[0];
	if (!instant?.metrics.length) {
		return { severityInstant: [] };
	}

	const severityInstant = instant.metrics.map((metric) => {
		const pollenInfo = POLLEN_LOOKUP.get(metric.type);
		const unitInfo = UNIT_LOOKUP.get(metric.unit);

		return {
			name: pollenInfo?.name ?? metric.type,
			severityName: metric.severity.name,
			symbol: metric.severity.symbol.trim(),
			value: metric.value,
			unit: unitInfo?.name ?? metric.unit,
			description: metric.severity.description ?? pollenInfo?.description ?? ''
		};
	});

	severityInstant.sort((a, b) => b.value - a.value);

	return { severityInstant };
}
