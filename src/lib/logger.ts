import { createLogger, consoleProvider, nullProvider } from '$lib/logging';
import { dev } from '$app/environment';

export const logger = createLogger(
	import.meta.env.MODE === 'test' ? nullProvider : consoleProvider,
	dev ? 'debug' : 'info'
);
