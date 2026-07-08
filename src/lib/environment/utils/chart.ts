import { toUTCDate, type UTCDate } from '$lib/date';
import type { EnvironmentObservation, PollenType } from '../types';

export function calculateMissingDataRanges(
	seriesData: EnvironmentObservation[] | undefined,
	selectedPollenTypes: PollenType[],
	xDomainStart: UTCDate,
	xDomainEnd: UTCDate
): [UTCDate, UTCDate][] {
	const start = xDomainStart;
	const end = xDomainEnd;

	if (!seriesData || seriesData.length === 0) {
		return [[start, end]];
	}

	const ranges: [UTCDate, UTCDate][] = [];
	let gapStart: UTCDate | null = null;
	let lastValidInstant: UTCDate | null = null;

	for (let i = 0; i < seriesData.length; i++) {
		const observation = seriesData[i];
		const hasData = observation.pollen.some((m) => selectedPollenTypes.includes(m.type));

		if (hasData) {
			lastValidInstant = toUTCDate(observation.createdAt);
			if (gapStart) {
				ranges.push([gapStart, lastValidInstant]);
				gapStart = null;
			}
		} else if (!gapStart) {
			// Start gap from the last known valid data point
			gapStart = lastValidInstant ?? toUTCDate(observation.createdAt);
		}
	}

	if (gapStart) {
		ranges.push([gapStart, end]);
	}

	return ranges;
}
