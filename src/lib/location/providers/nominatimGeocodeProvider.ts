import type { GeocodeProvider } from '../types';

export const nominatimGeocodeProvider = (): GeocodeProvider => ({
	async forward(query) {
		const results = await fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
		);

		const data = await results.json();

		return data.map((d: any) => ({
			label: d.display_name,
			coordinates: { lat: Number(d.lat), lon: Number(d.lon) }
		}));
	},

	async reverse(coordinates) {
		const results = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lon}`
		);

		const data = await results.json();

		return {
			label: data.display_name,
			lat: coordinates.lat,
			lon: coordinates.lon,
			source: 'gps'
		};
	}
});
