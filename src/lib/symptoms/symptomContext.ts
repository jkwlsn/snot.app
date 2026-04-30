import { createContext } from 'svelte';
import type { SymptomService, SymptomState } from './types';

export const [getSymptomService, setSymptomService] = createContext<SymptomService>();

export const [getSymptomState, setSymptomState] = createContext<SymptomState>();
