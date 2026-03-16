import type { GeolocationProvider } from '../types';

export const browserGeolocationProvider = (): GeolocationProvider => ({
	async getCurrentPosition() {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(
				(position) =>
					resolve({
						lat: position.coords.latitude,
						lon: position.coords.longitude
					}),
				reject
			);
		});
	}
});
