import { POLLEN_UNITS, POLLENS } from "../config";
import type { PollenType, PollenUnit } from "../types";

export const UNIT_LOOKUP = new Map(POLLEN_UNITS.map((u) => [u.id, u]));

export function getPollenName(id: PollenType): string {
  return POLLENS[id]?.name ?? id;
}

export function getPollenUnit(id: PollenUnit): string {
  return UNIT_LOOKUP.get(id)?.name ?? id;
}
