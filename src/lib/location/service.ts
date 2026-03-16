import type { GeocodeProvider, GeolocationProvider } from './types';

export const createLocationService = ({
	geocode,
	geolocation
}: {
	geocode: GeocodeProvider;
	geolocation: GeolocationProvider;
}) => {
	const locateFromBrowser = async () => {
		const coordinates = await geolocation.getCurrentPosition();
		return geocode.reverse(coordinates);
	};

	const searchLocation = async (query: string) => {
		return geocode.forward(query);
	};

	return { locateFromBrowser, searchLocation };
};
