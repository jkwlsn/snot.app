import { createContext } from 'svelte';
import type { SymptomRepository } from './types.ts';

export const [getSymptomRepository, setSymptomRepository] = createContext<SymptomRepository>();
