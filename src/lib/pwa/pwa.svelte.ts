import { registerSW } from 'virtual:pwa-register';
import { createLogger, consoleProvider } from '$lib/logging';

const logger = createLogger(consoleProvider);

const intervalMS = 60 * 60 * 1000;

registerSW({
	onRegisteredSW(_swUrl, r) {
		// poll for updates every hour
		if (r) {
			setInterval(() => r.update(), intervalMS);
		}
		logger.debug('Service worker updated');
	}
});
