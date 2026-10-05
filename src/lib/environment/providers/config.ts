import { Unit } from "@openmeteo/sdk/unit";
import type { PollenType, PollenUnit } from "../types";

export const OPENMETEO_POLLEN_PARAM = {
  alder: "alder_pollen",
  birch: "birch_pollen",
  grass: "grass_pollen",
  mugwort: "mugwort_pollen",
  olive: "olive_pollen",
  ragweed: "ragweed_pollen",
} as const satisfies Record<PollenType, string>;

export const OPENMETEO_CONFIG = {
  url: "https://air-quality-api.open-meteo.com/v1/air-quality",
  maxForecastDays: 4,
  supportedPollenIds: Object.keys(OPENMETEO_POLLEN_PARAM) as PollenType[],
  unitMap: {
    [Unit.grains_per_cubic_metre]: "grains_m3",
  } as Partial<Record<Unit, PollenUnit>>,
};
