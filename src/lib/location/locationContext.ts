import { createContext } from 'svelte';
import type { LocationService } from './types';

export const [getLocationService, setLocationService] = createContext<LocationService>();
