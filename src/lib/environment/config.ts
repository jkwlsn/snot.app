export const POLLENS = [
	{ id: 'alder_pollen', name: 'Alder', description: 'Pollen from birch trees', color: '#e41a1c' },
	{ id: 'ash_pollen', name: 'Ash', description: '', color: '' },
	{ id: 'birch_pollen', name: 'Birch', description: '', color: '#377eb8' },
	{ id: 'cedar_pollen', name: 'Cedar', description: '', color: '' },
	{ id: 'elm_pollen', name: 'Elm', description: '', color: '' },
	{ id: 'hazel_pollen', name: 'Hazel', description: '', color: '' },
	{ id: 'oak_pollen', name: 'Oak', description: '', color: '' },
	{ id: 'olive_pollen', name: 'Olive', description: '', color: '#ff7f00' },
	{ id: 'pine_pollen', name: 'Pine', description: '', color: '' },
	{ id: 'plane_pollen', name: 'Plane', description: '', color: '' },
	{ id: 'poplar_pollen', name: 'Poplar', description: '', color: '' },
	{ id: 'grass_pollen', name: 'Grass', description: '', color: '#4daf4a' },
	{ id: 'ragweed_pollen', name: 'Ragweed', description: '', color: '#a65628' },
	{ id: 'mugwort_pollen', name: 'Mugwort', description: '', color: '#984ea3' },
	{ id: 'nettle_pollen', name: 'Nettle', description: '', color: '' }
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
