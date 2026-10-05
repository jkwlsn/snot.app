import type { PollenType } from "./types";

export const POLLEN_IDS = ["alder", "birch", "grass", "mugwort", "olive", "ragweed"] as const;

export const POLLENS: Record<PollenType, { name: string; description: string }> = {
  alder: { name: "Alder", description: "Pollen from alder trees." },
  birch: { name: "Birch", description: "Pollen from birch trees." },
  grass: { name: "Grass", description: "Pollen from grass." },
  mugwort: { name: "Mugwort", description: "Pollen from mugwort plants." },
  olive: { name: "Olive", description: "Pollen from olive trees." },
  ragweed: { name: "Ragweed", description: "Pollen from ragweed." },
};

export const POLLEN_UNITS = [
  { id: "grains_m3", name: "Grains/m³", description: "Pollen grains per cubic metre" },
] as const;
