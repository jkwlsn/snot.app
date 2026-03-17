import type { Logger } from '$lib/logging';
import type {
	GeocodeProvider,
	GeolocationProvider,
	LocationCoordinates,
	LocationService
} from './types';

const CONTEXT = { module: 'location', function: 'createLocationService' };

export const createLocationService = ({
	geocode,
	geolocation,
	logger
}: {
	geocode: GeocodeProvider;
	geolocation: GeolocationProvider;
	logger: Logger;
}): LocationService => {
	const getBrowserLocation = async () => {
		logger.debug('Requesting GPS coordinates', { ...CONTEXT, function: 'getBrowserLocation' });
		const coordinates = await geolocation.getCurrentPosition();

		if (!coordinates) {
			logger.warn('GPS returned null', {
				...CONTEXT,
				function: 'getBrowserLocation'
			});
			return null;
		}

		logger.debug('Received coordinates', {
			...CONTEXT,
			function: 'getBrowserLocation',
			coordinates
		});

		const location = await geocode.reverse(coordinates);

		if (!location) {
			logger.warn('Reverse Geocode returned null', {
				...CONTEXT,
				function: 'getBrowserLocation',
				coordinates
			});
			return null;
		}

		logger.info('Location resolved', {
			...CONTEXT,
			function: 'getBrowserLocation',
			location
		});

		return location;
	};

	const forwardGeocode = async (query: string) => {
		logger.debug('Attempting forward geocode', {
			...CONTEXT,
			function: 'forwardGeocode',
			data: query
		});
		const results = await geocode.forward(query);
		logger.debug('Forward geocode results', {
			...CONTEXT,
			function: 'forwardGeocode',
			data: results
		});
		return results;
	};

	const reverseGeocode = async (coordinates: LocationCoordinates) => {
		logger.debug('Attempting reverse geocode', {
			...CONTEXT,
			function: 'reverseGeocode',
			data: coordinates
		});

		const location = await geocode.reverse(coordinates);

		if (!location) {
			logger.debug('Reverse Geocode returned null', {
				...CONTEXT,
				function: 'reverseGeocode',
				data: location
			});
			return null;
		}

		logger.debug('Reverse geocode results', {
			...CONTEXT,
			function: 'reverseGeocode',
			data: location
		});

		return location;
	};

	return { getBrowserLocation, forwardGeocode, reverseGeocode };
};
