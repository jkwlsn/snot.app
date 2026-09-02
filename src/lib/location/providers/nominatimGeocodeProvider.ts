import { roundTo1km } from '../utils';
import type { GeocodeProvider } from '../types';

interface NominatimForwardResponse {
	display_name: string;
	lat: string;
	lon: string;
}

const BASE = import.meta.env.VITE_GEOCODE_API_BASE;

export const nominatimGeocodeProvider = (): GeocodeProvider => ({
	async forward(query) {
		const response = await fetch(`${BASE}/search?format=json&q=${encodeURIComponent(query)}`);

		if (!response.ok) {
			throw new Error('Forward geocode failed');
		}

		const data = await response.json();

		if (!data) {
			throw new Error('Parsing forward geocode failed');
		}

		return data.map((d: NominatimForwardResponse) => ({
			label: d.display_name,
			coordinates: {
				latitude: roundTo1km(Number(d.lat)),
				longitude: roundTo1km(Number(d.lon))
			}
		}));
	},

	async reverse(coordinates) {
		const lat = roundTo1km(coordinates.latitude);
		const lon = roundTo1km(coordinates.longitude);
		const response = await fetch(`${BASE}/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14`);

		if (!response.ok) {
			throw new Error(`Geocoding failed (${response.status})`);
		}

		const data = await response.json();

		if (!data) {
			throw new Error('Parsing reverse geocode failed');
		}

		return {
			label: data.display_name,
			coordinates: {
				latitude: lat,
				longitude: lon
			}
		};
	}
});
