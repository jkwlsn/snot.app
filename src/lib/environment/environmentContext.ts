import { createContext } from 'svelte';
import type { EnvironmentService, EnvironmentState } from './types';

export const [getEnvironmentService, setEnvironmentService] = createContext<EnvironmentService>();
export const [getEnvironmentState, setEnvironmentState] = createContext<EnvironmentState>();
