export { addSeverityToSeries, addSeverityToInstant } from './calculator';
export { createPollenSeverityNotifications } from './notifications';

export { default as SeverityIndicator } from './components/SeverityIndicator.svelte';

export type {
	PollenSeverityNotification,
	PollenSeriesWithSeverity,
	PollenInstantWithSeverity,
	PollenSeverityLevel
} from './types';
