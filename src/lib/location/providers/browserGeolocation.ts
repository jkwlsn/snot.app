import type { GeolocationProvider } from '../types';

export const browserGeolocationProvider = (): GeolocationProvider => ({
	async getCurrentPosition() {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(
				(position) =>
					resolve({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					}),
				reject
			);
		});
	}
});
