import type {
	GeocodeProvider,
	GeolocationProvider,
	LocationCoordinates,
	LocationService
} from './types';

export const createLocationService = ({
	geocode,
	geolocation
}: {
	geocode: GeocodeProvider;
	geolocation: GeolocationProvider;
}): LocationService => {
	const getBrowserLocation = async () => {
		const coordinates = await geolocation.getCurrentPosition();

		if (!coordinates) return null;

		const location = await geocode.reverse(coordinates);

		if (!location) return null;

		return location;
	};

	const forwardGeocode = async (query: string) => {
		return await geocode.forward(query);
	};

	const reverseGeocode = async (coordinates: LocationCoordinates) => {
		const location = await geocode.reverse(coordinates);

		if (!location) return null;

		return location;
	};

	return { getBrowserLocation, forwardGeocode, reverseGeocode };
};
