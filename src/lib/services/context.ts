import { createContext } from 'svelte';
import type { SymptomService } from './types';

export const [getSymptomService, setSymptomService] = createContext<SymptomService>();
