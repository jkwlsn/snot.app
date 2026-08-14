export { addSeverityToObservation, addSeverityToObservations } from './calculator';
export { createPollenSeverityNotifications } from './notifications';

export { default as SeverityIndicator } from './components/SeverityIndicator.svelte';
export { default as SeverityThresholdInput } from './components/SeverityThresholdInput.svelte';

export type { EnvironmentObservationWithSeverity, PollenSeverityLevel } from './types';
