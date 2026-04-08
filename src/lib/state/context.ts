import { createContext } from 'svelte';
import type { SymptomsState } from './symptoms.svelte';

export const [getSymptomsContext, setSymptomsContext] = createContext<SymptomsState>();
