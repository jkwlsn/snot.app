import { createContext } from 'svelte';
import type { SymptomService } from '$lib/types';

export const [getSymptomService, setSymptomService] = createContext<SymptomService>();
