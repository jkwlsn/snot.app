import { createContext } from 'svelte';
import type { EnvironmentService } from './types';

export const [getEnvironmentService, setEnvironmentService] = createContext<EnvironmentService>();
