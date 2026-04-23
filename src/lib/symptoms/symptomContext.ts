import { createContext } from 'svelte';
import type { SymptomRepository, SymptomService, SymptomState } from '$lib/types';

export const [getSymptomRepository, setSymptomRepository] = createContext<SymptomRepository>();

export const [getSymptomService, setSymptomService] = createContext<SymptomService>();

export const [getSymptomState, setSymptomState] = createContext<SymptomState>();
