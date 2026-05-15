import type { PollenSeries, PollenType } from '../types';

export function calculateMissingDataRanges(
	seriesData: PollenSeries | undefined,
	selectedPollenTypes: PollenType[],
	xDomainStart: Date,
	xDomainEnd: Date
): [Date, Date][] {
	if (!seriesData || !seriesData.instants || seriesData.instants.length === 0) {
		return [[xDomainStart, xDomainEnd]];
	}

	const ranges: [Date, Date][] = [];
	let gapStart: Date | null = null;

	for (let i = 0; i < seriesData.instants.length; i++) {
		const instant = seriesData.instants[i];
		const hasData = instant.metrics.some((m) => selectedPollenTypes.includes(m.type));

		if (!hasData && !gapStart) {
			gapStart = instant.createdAt;
		} else if (hasData && gapStart) {
			ranges.push([gapStart, instant.createdAt]);
			gapStart = null;
		}
	}

	if (gapStart) {
		ranges.push([gapStart, xDomainEnd]);
	} else {
		const lastInstant = seriesData.instants[seriesData.instants.length - 1];
		if (lastInstant.createdAt < xDomainEnd) {
			ranges.push([lastInstant.createdAt, xDomainEnd]);
		}
	}

	return ranges;
}
