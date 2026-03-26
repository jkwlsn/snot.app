export const ssr = false;
export const prerender = true;

import { createLogger, consoleProvider } from '$lib/logging';

const logger = createLogger(consoleProvider);

logger.debug('App loaded');
