import { createContext } from 'svelte';
import type { SymptomRepository } from '$lib/types';

export const [getSymptomRepository, setSymptomRepository] = createContext<SymptomRepository>();
