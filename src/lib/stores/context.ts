import { createContext } from 'svelte';
import type { SymptomsStore } from '$lib/stores/symptomsStore.svelte';

export const [getSymptomsContext, setSymptomsContext] = createContext<SymptomsStore>();
