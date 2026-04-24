import { createContext } from 'svelte';
import type { LocationService } from '$lib/types';

export const [getLocationService, setLocationService] = createContext<LocationService>();
