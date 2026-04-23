import type { Logger } from '$lib/logging';
import type { GeolocationProvider } from '$lib/types';

const CONTEXT = { module: 'location', function: 'browserGeolocationProvider' };

export const browserGeolocationProvider = (logger: Logger): GeolocationProvider => ({
	async getCurrentPosition() {
		return new Promise((resolve, reject) => {
			logger.debug('Attempting to get current position', { ...CONTEXT });
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const coordinates = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					};
					logger.debug('Successfully got position', { ...CONTEXT, coordinates });
					resolve(coordinates);
				},
				(err) => {
					const error = err instanceof Error ? err : new Error(String(err));
					logger.error('Failed to get position', { ...CONTEXT, error });
					reject(new Error(err.message));
				}
			);
		});
	}
});
