import type { GeocodeProvider } from '../types';

type NominatimResult = {
	display_name: string;
	lat: string;
	lon: string;
};

export const nominatimGeocodeProvider = (): GeocodeProvider => ({
	async forward(query) {
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
			);

			if (!res.ok) {
				throw new Error(`Geocoding failed (${res.status})`);
			}

			const data = await res.json();

			return data.map((d: NominatimResult) => ({
				label: d.display_name,
				coordinates: {
					lat: Number(d.lat),
					lon: Number(d.lon)
				}
			}));
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			throw error;
		}
	},

	async reverse(coordinates) {
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lon}`
			);

			if (!res.ok) {
				throw new Error(`Reverse geocoding failed (${res.status})`);
			}

			const data = await res.json();

			return {
				label: data.display_name,
				coordinates: coordinates
			};
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			throw error;
		}
	}
});
