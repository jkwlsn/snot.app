import { Unit } from '@openmeteo/sdk/unit';
import type { PollenType, PollenUnit } from '../types';

export const OPENMETEO_CONFIG = {
	url: 'https://air-quality-api.open-meteo.com/v1/air-quality',
	maxForecastDays: 4,
	supportedPollenIds: [
		'alder_pollen',
		'birch_pollen',
		'grass_pollen',
		'mugwort_pollen',
		'olive_pollen',
		'ragweed_pollen'
	] as const satisfies ReadonlyArray<PollenType>,
	unitMap: {
		[Unit.grains_per_cubic_metre]: 'grains_m3'
	} as Partial<Record<Unit, PollenUnit>>
};
