import type { Logger } from '$lib/logging';
import type { LocationCoordinates } from '$lib/types';
import type { GeocodeProvider, GeolocationProvider, LocationService } from './types';

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

		let location;
		try {
			location = await geocode.reverse(coordinates);
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			logger.error('Failed to get GPS coordinates', { ...CONTEXT, error });
			throw error;
		}

		if (!location) {
			logger.warn('Reverse Geocode returned null', {
				...CONTEXT,
				function: 'getBrowserLocation',
				coordinates
			});
			throw new Error('Reverse Geocode returned null');
		}

		logger.info('Location resolved', {
			...CONTEXT,
			function: 'reverseGeocode',
			location
		});

		return location;
	};

	return { getBrowserLocation, forwardGeocode, reverseGeocode };
};
