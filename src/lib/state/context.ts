import { createContext } from 'svelte';
import type { SymptomsState } from '$lib/types';

export const [getSymptomsContext, setSymptomsContext] = createContext<SymptomsState>();
