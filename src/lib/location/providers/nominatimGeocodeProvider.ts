import type { GeocodeProvider, UserLocation } from '../types';

type NominatimForwardResult = {
	display_name: string;
	latitude: string;
	longitude: string;
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

			return data.map((d: NominatimForwardResult) => ({
				label: d.display_name,
				coordinates: {
					latitude: Number(d.latitude),
					longitude: Number(d.longitude)
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
				`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.latitude}&lon=${coordinates.longitude}`
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
