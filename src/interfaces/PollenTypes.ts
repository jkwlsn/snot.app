import type { OPENMETEO_POLLEN_TYPES } from "../config";

export type PollenType = (typeof OPENMETEO_POLLEN_TYPES)[number];

export type PollenLevels = Record<PollenType, number | null>;
