import { handleError } from '$lib/errors';
import type {
	LocationCoordinates,
	GeocodeProvider,
	GeolocationProvider,
	LocationService,
	LoggingService
} from '$lib/types';

export const createLocationService = ({
	geocode,
	geolocation,
	logger
}: {
	geocode: GeocodeProvider;
	geolocation: GeolocationProvider;
	logger: LoggingService;
}): LocationService => {
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
};
