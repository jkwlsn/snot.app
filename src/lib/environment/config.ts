export const POLLENS = [
	{ id: 'alder_pollen', name: 'Alder', description: 'Pollen from birch trees' },
	{ id: 'ash_pollen', name: 'Ash', description: '' },
	{ id: 'birch_pollen', name: 'Birch', description: '' },
	{ id: 'cedar_pollen', name: 'Cedar', description: '' },
	{ id: 'elm_pollen', name: 'Elm', description: '' },
	{ id: 'hazel_pollen', name: 'Hazel', description: '' },
	{ id: 'oak_pollen', name: 'Oak', description: '' },
	{ id: 'olive_pollen', name: 'Olive', description: '' },
	{ id: 'pine_pollen', name: 'Pine', description: '' },
	{ id: 'plane_pollen', name: 'Plane', description: '' },
	{ id: 'poplar_pollen', name: 'Poplar', description: '' },
	{ id: 'grass_pollen', name: 'Grass', description: '' },
	{ id: 'ragweed_pollen', name: 'Ragweed', description: '' },
	{ id: 'mugwort_pollen', name: 'Mugwort', description: '' },
	{ id: 'nettle_pollen', name: 'Nettle', description: '' }
] as const;

export const POLLEN_UNITS = [
	{ id: 'grains_m3', name: 'Grains/m³', description: 'Pollen grains per cubic metre' }
] as const;

export const POLLEN_SEVERITY = [
	{ id: 1, min: 150, name: 'Very High', symbol: '🔴 ', description: '' },
	{ id: 2, min: 60, name: 'High', symbol: '🟠', description: '' },
	{ id: 3, min: 30, name: 'Moderate', symbol: '🟡', description: '' },
	{ id: 4, min: 1, name: 'Low', symbol: '🟢', description: '' },
	{ id: 5, min: 0, name: 'None', symbol: '⚪', description: '' }
] as const;
