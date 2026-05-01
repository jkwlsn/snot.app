import { browserGeolocationProvider } from './providers/browserGeolocation';
import { nominatimGeocodeProvider } from './providers/nominatimGeocodeProvider';
import { handleError } from '$lib/errors';
import type { LocationCoordinates, LocationService } from './types';
import type { LoggingService } from '$lib/logging';

export function createLocationService({ logger }: { logger: LoggingService }): LocationService {
	const geolocation = browserGeolocationProvider();
	const geocode = nominatimGeocodeProvider();

	const getBrowserLocation = async () => {
		try {
			const coordinates = await geolocation.getCurrentPosition();

			if (!coordinates) {
				throw new Error('GPS returned null');
			}

			return await reverseGeocode(coordinates);
		} catch (err) {
			throw handleError({ error: err, operation: 'getBrowserLocation', logger });
		}
	};

	const forwardGeocode = async (query: string) => {
		try {
			return await geocode.forward(query);
		} catch (err) {
			throw handleError({
				error: err,
				operation: 'forwardGeocode',
				logger,
				context: { query }
			});
		}
	};

	const reverseGeocode = async (coordinates: LocationCoordinates) => {
		try {
			const location = await geocode.reverse(coordinates);
			if (!location) {
				throw new Error('Reverse Geocode returned null');
			}
			return location;
		} catch (err) {
			throw handleError({
				error: err,
				operation: 'reverseGeocode',
				logger,
				context: { coordinates }
			});
		}
	};

	return { getBrowserLocation, forwardGeocode, reverseGeocode };
}
