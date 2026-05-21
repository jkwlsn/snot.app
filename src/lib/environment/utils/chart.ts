import { toUTCDate, type UTCDate } from '$lib/date';
import type { PollenSeries, PollenType } from '../types';

export function calculateMissingDataRanges(
	seriesData: PollenSeries | undefined,
	selectedPollenTypes: PollenType[],
	xDomainStart: UTCDate,
	xDomainEnd: UTCDate
): [UTCDate, UTCDate][] {
	const start = xDomainStart;
	const end = xDomainEnd;

	if (!seriesData || !seriesData.instants || seriesData.instants.length === 0) {
		return [[start, end]];
	}

	const ranges: [UTCDate, UTCDate][] = [];
	let gapStart: UTCDate | null = null;
	let lastValidInstant: UTCDate | null = null;

	for (let i = 0; i < seriesData.instants.length; i++) {
		const instant = seriesData.instants[i];
		const hasData = instant.metrics.some((m) => selectedPollenTypes.includes(m.type));

		if (hasData) {
			lastValidInstant = toUTCDate(instant.createdAt);
			if (gapStart) {
				ranges.push([gapStart, lastValidInstant]);
				gapStart = null;
			}
		} else if (!gapStart) {
			// Start gap from the last known valid data point
			gapStart = lastValidInstant ?? toUTCDate(instant.createdAt);
		}
	}

	if (gapStart) {
		ranges.push([gapStart, end]);
	}

	return ranges;
}
