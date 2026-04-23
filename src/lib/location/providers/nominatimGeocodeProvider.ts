import type { Logger } from '$lib/logging';
import type { GeocodeProvider } from '$lib/types';

interface NominatimForwardResponse {
	display_name: string;
	lat: string;
	lon: string;
}

const BASE = import.meta.env.VITE_GEOCODE_API_BASE;
const CONTEXT = { module: 'location', function: 'nominatimGeocodeProvider', baseUrl: BASE };

export const nominatimGeocodeProvider = (logger: Logger): GeocodeProvider => ({
	async forward(query) {
		try {
			logger.debug('Attempting forward geocode', { ...CONTEXT });
			const response = await fetch(`${BASE}/search?format=json&q=${encodeURIComponent(query)}`);

			if (!response.ok) {
				const error = new Error('Forward geocode failed');
				logger.error(error.message, { ...CONTEXT, status: response.status, error });
				throw error;
			}

			const data = await response.json();

			if (!data) {
				const error = new Error('Parsing forward geocode failed');
				logger.error(error.message, { ...CONTEXT, status: response.status, error });
				throw error;
			}

			logger.debug('Successful forward geocode', { ...CONTEXT, data });

			return data.map((d: NominatimForwardResponse) => ({
				label: d.display_name,
				coordinates: {
					latitude: Number(d.lat),
					longitude: Number(d.lon)
				}
			}));
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error('Forward geocode failed', { ...CONTEXT, error });
			throw error;
		}
	},

	async reverse(coordinates) {
		try {
			logger.debug('Attempting reverse geocode', { ...CONTEXT });
			const response = await fetch(
				`${BASE}/reverse?format=json&lat=${coordinates.latitude}&lon=${coordinates.longitude}`
			);

			if (!response.ok) {
				throw new Error(`Geocoding failed (${response.status})`);
			}

			const data = await response.json();

			if (!data) {
				const error = new Error('Parsing reverse geocode failed');
				logger.error(error.message, { ...CONTEXT, status: response.status, error });
				throw error;
			}

			logger.debug('Successful reverse geocode', { ...CONTEXT, data });

			return {
				label: data.display_name,
				coordinates: coordinates
			};
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error('Reverse geocode failed', { ...CONTEXT, error });
			throw error;
		}
	}
});
