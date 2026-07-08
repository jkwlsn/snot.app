import type { UTCDate } from '@date-fns/utc';
import type { PollenInstant, PollenMetric, PollenSeries, PollenType, PollenUnit } from '../types';
import type { UserLocation } from '$lib/location';

export interface PollenSeverityLevel {
	id: number;
	level: string;
	threshold: number;
	symbol: string;
	description: string;
}

export interface PollenMetricWithSeverity extends PollenMetric {
	severity: PollenSeverityLevel;
}

export interface PollenInstantWithSeverity extends PollenInstant {
	metrics: PollenMetricWithSeverity[];
}

export interface PollenSeriesWithSeverity extends PollenSeries {
	instants: PollenInstantWithSeverity[];
}

export interface PollenSeverityNotification {
	timestamp: UTCDate;
	location: UserLocation | null;
	pollen: PollenType;
	value: number;
	unit: PollenUnit;
	severity: PollenSeverityLevel;
}
