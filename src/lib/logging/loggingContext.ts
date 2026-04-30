import { createContext } from 'svelte';
import type { LoggingService } from './types';

export const [getLoggingService, setLoggingService] = createContext<LoggingService>();
